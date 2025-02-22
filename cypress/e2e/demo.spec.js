/// <reference types="cypress" />


describe("Verify regression test running with multiple logins", () => {
  const phoneData = {
    "0911994232": { web: "thamsofaphongkhach.com", owner: "Đồng" },
    "0919904988": { web: "thamsofadep.com", owner: "Hạnh (Đồng)" },
    "0989912391": { web: "thamtraisofadep.com", owner: "Vẹn" },
    "0909976558": { web: "thamtrangtridep.com", owner: "Yên" },
    "0906375514": { web: "thamdepchinhhang.com", owner: "Hồng Hạnh" },
    "0919677612": { web: "thamsofa.khotahmdep.net", owner: "Mạnh" },
    "0981450121": { web: "thamsofacaocap.com", owner: "Dung" },
    "0916643608": { web: "thamdepcaocap.com", owner: "Loan" },
    "0904338082": { web: "thamsofachinhhang.com", owner: "chị Chưởng" },
    "0906126635": { web: "thamsofatrangtri.com", owner: "Đẩu" },
  };
  const jsonFilePath = "cypress/reports/all-orders.json";
  const summaryCsvFilePath = "cypress/reports/monthly-summary.csv";

  Object.keys(phoneData).forEach((phone) => {
    it(`Login and collect orders for ${phone}`, { tags: "@regression" }, () => {
      cy.testStep("Navigate admin page");
      cy.visit("https://app.3hrugs.com/admin");

      cy.testStep(`Login with ${phone}`);
      cy.get('input[type="text"]').clear().type(phone);
      cy.get('[label="login"]').click();

      cy.intercept("GET", "https://nodeapi.nhilong.com/donhang**").as(
        "donhang"
      );
      cy.get('a[href*="/orders"]').click();
      cy.wait("@donhang").then((xhr) => {
        const newData = xhr.response.body.data
        .filter(order => order.trangthai === "Đã giao") // ✅ Chỉ lấy đơn hàng đã giao
        .map((order) => ({
          ...order,
          phone, // Gán số điện thoại vào đơn hàng
          web: phoneData[phone] ? phoneData[phone].web : "N/A",
          owner: phoneData[phone] ? phoneData[phone].owner : "N/A",
        }));

        cy.readFile(jsonFilePath, { log: false }).then((oldData) => {
          if (typeof oldData !== "object") {
            oldData = {}; // Nếu JSON trống, tạo object mới
          }
          if (!oldData[phone]) {
            oldData[phone] = [];
          }

          // Tìm đơn hàng mới
          const added = newData.filter(
            (newItem) =>
              !oldData[phone].some(
                (oldItem) => JSON.stringify(oldItem) === JSON.stringify(newItem)
              )
          );

          if (added.length > 0) {
            cy.log(`✅ Thêm ${added.length} đơn hàng mới từ ${phone}`);
            oldData[phone] = [...oldData[phone], ...added]; // Cập nhật dữ liệu

            cy.writeFile(jsonFilePath, oldData, { log: false }); // Ghi JSON đúng cách
          } else {
            cy.log(`✅ Không có đơn hàng mới từ ${phone}`);
          }

          // **Cập nhật thống kê tổng số đơn hàng theo từng tháng**
          const monthlyOrders = {};
          oldData[phone].forEach((order) => {
            const [day, month, year] = order.ngaygiao.split("-").map(Number);
            const key = `${month}-${year}`;

            if (!monthlyOrders[key]) {
              monthlyOrders[key] = 0;
            }
            monthlyOrders[key] += 1;
          });

          cy.readFile(summaryCsvFilePath, { log: false }).then(
            (summaryData) => {
              let rows = summaryData
                .split("\n")
                .filter((row) => row.trim() !== "");
              const header =
                // rows.shift() || "month,year,phone,total_orders,web,owner"; // Đảm bảo tiêu đề tồn tại
                rows.shift() || "month-year,phone,total_orders,web,owner"; // Đảm bảo tiêu đề tồn tại

              Object.entries(monthlyOrders).forEach(
                ([monthYear, totalOrders]) => {
                  const [month, year] = monthYear.split("-");
                  const key = `${String(month).padStart(2, "0")}-${year}`; // Định dạng mm-yyyy
                  const web = phoneData[phone] ? phoneData[phone].web : "N/A";
                  const owner = phoneData[phone]
                    ? phoneData[phone].owner
                    : "N/A";
                  // const newSummaryRow = `${month},${year},${phone},${totalOrders},${web},${owner}`;
                  const newSummaryRow = `${key},${phone},${totalOrders},${web},${owner}`;

                  const existingIndex = rows.findIndex((row) =>
                    // row.includes(`${month},${year},${phone}`)
                    row.includes(`${key},${phone}`)
                  );

                  if (existingIndex > -1) {
                    rows[existingIndex] = newSummaryRow;
                  } else {
                    rows.push(newSummaryRow);
                  }
                }
              );

              cy.writeFile(
                summaryCsvFilePath,
                [header, ...rows].join("\n") + "\n",
                { log: false }
              );
            }
          );
        });
      });
    });
  });
});
