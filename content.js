// Tạo một modal popup
let modal = document.createElement("div");
modal.style.display = "none";
modal.style.position = "fixed";
modal.style.zIndex = "9999";
modal.style.width = "400px";
modal.style.height = "500px";
modal.style.top = "50%";
modal.style.left = "50%";
modal.style.marginTop = "-150px";
modal.style.marginLeft = "-200px";
modal.style.border = "1px solid black";
modal.style.backgroundColor = "#fff";
modal.style.color = "#000";
modal.style.padding = "20px";
// Chọn phần tử cần chèn modal vào (ở đây là phần tử body)
const body = document.querySelector("body");
// Chèn modal vào cuối phần tử body
body.appendChild(modal);
// Tạo các trường nhập liệu
let inputName = document.createElement("input");
inputName.setAttribute("type", "text");
inputName.setAttribute("placeholder", "Name");
inputName.style.marginBottom = "10px";
inputName.style.width = "100%";
let labelName = document.createElement("label");
labelName.innerHTML = "Tên khách hàng:";
labelName.setAttribute("for", "inputName");
labelName.appendChild(inputName);

let inputDescription = document.createElement("textarea");
inputDescription.setAttribute("type", "text");
inputDescription.setAttribute("placeholder", "Description");
inputDescription.style.height = "100px";
inputDescription.style.width = "100%";
let labelDescription = document.createElement("label");
labelDescription.innerHTML = "Mô tả:";
labelDescription.setAttribute("for", "inputDescription");
labelDescription.appendChild(inputDescription);

let inputOfficeAddress = document.createElement("input");
inputOfficeAddress.setAttribute("type", "text");
inputOfficeAddress.setAttribute("placeholder", "Office Address");
inputOfficeAddress.style.marginBottom = "10px";
inputOfficeAddress.style.width = "100%";
let labelOfficeAddress = document.createElement("label");
labelOfficeAddress.innerHTML = "Địa chỉ văn phòng:";
labelOfficeAddress.setAttribute("for", "inputOfficeAddress");
labelOfficeAddress.appendChild(inputOfficeAddress);

let inputEmail = document.createElement("input");
inputEmail.setAttribute("type", "text");
inputEmail.setAttribute("placeholder", "Email");
inputEmail.style.marginBottom = "10px";
inputEmail.style.width = "100%";
let labelEmail = document.createElement("label");
labelEmail.innerHTML = "Email:";
labelEmail.setAttribute("for", "inputEmail");
labelEmail.appendChild(inputEmail);

let inputPhone = document.createElement("input");
inputPhone.setAttribute("type", "text");
inputPhone.setAttribute("placeholder", "Phone Number");
inputPhone.style.marginBottom = "10px";
inputPhone.style.width = "100%";
let labelPhone = document.createElement("label");
labelPhone.innerHTML = "Điện thoại:";
labelPhone.setAttribute("for", "inputPhone");
labelPhone.appendChild(inputPhone);

// Tạo phần tử h2 để chứa tiêu đề
let title = document.createElement("h2");
title.innerHTML = "Thêm mới Khách hàng";

// Thêm tiêu đề vào modal
modal.appendChild(title);
// Thêm các trường nhập liệu vào modal
modal.appendChild(labelName);
modal.appendChild(labelDescription);
modal.appendChild(labelOfficeAddress);
modal.appendChild(labelEmail);
modal.appendChild(labelPhone);
// Tạo một div bao quanh cả hai nút "Submit" và "Close"
const buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.bottom = "0";
buttonContainer.style.left = "0";
buttonContainer.style.display = "flex";
buttonContainer.style.justifyContent = "flex-start";

// Thêm nút Submit vào phần tử cha
const submitButton = document.createElement("button");
submitButton.innerText = "Lưu";
submitButton.style.marginTop = "10px";
submitButton.style.float = "right";
buttonContainer.appendChild(submitButton);

// Thêm nút Close vào phần tử cha
const closeButton = document.createElement("button");
closeButton.innerText = "Đóng";
closeButton.style.marginTop = "10px";
closeButton.style.float = "right";
buttonContainer.appendChild(closeButton);

// Thêm phần tử cha vào modal
modal.appendChild(buttonContainer);

// Thêm div chứa hai nút vào modal popup
modal.appendChild(buttonContainer);
// Đăng ký sự kiện "click" cho nút "Close"
closeButton.addEventListener("click", () => {
  // Ẩn modal và xóa nút "Edit" khỏi tài liệu
  modal.style.display = "none";
  editButton.style.display = "none";
});
// Thêm nút "Close" vào modal popup
modal.appendChild(closeButton);
// Xử lý sự kiện khi người dùng nhấn phím ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    modal.style.display = "none";
  }
});
let selection;
let editButton;
//giải mã token
function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = JSON.parse(atob(base64));
  return decoded;
}
// Hàm kiểm tra tính hợp lệ của token
async function isTokenValid() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("token", function (result) {
      const token = result.token;
      // Kiểm tra tính hợp lệ của token
      const tokenExpirationTime = decodeToken(token).exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenExpirationTime < currentTime) {
        // Token đã hết hạn, không hợp lệ
        resolve(null);
      }

      // Token còn hiệu lực, hợp lệ
      resolve(token);
    });
  });
}

// Hàm lấy token mới
async function getNewToken() {
  // Gọi API để lấy token mới
  console.log("đi vào hàm getNewToken");
  const url = await new Promise((resolve) => {
    chrome.storage.local.get("url", (result) => {
      resolve(result.url);
    });
  });
  console.log(url);
  const username = await new Promise((resolve) => {
    chrome.storage.local.get("username", (result) => {
      resolve(result.username);
    });
  });
  console.log(username);
  const password = await new Promise((resolve) => {
    chrome.storage.local.get("password", (result) => {
      resolve(result.password);
    });
  });
  const passwordMd5 = MD5(password);
  console.log(password);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: passwordMd5,
    }),
  });
  const data = await response.json();
  console.log("đã gửi fecth trong hàm getNewToken");
  console.log(data);
  return data.token;
}

// Hàm gửi yêu cầu API
async function sendRequest(apiUrl, data) {
  const token = await isTokenValid();
  if (!token) {
    console.log("token hết hạn hoặc không hợp lệ");

    // Lấy token mới
    const newToken = await getNewToken();
    if (newToken) {
      console.log("Got new token");

      // Lưu token mới vào storage
      await chrome.storage.local.set({ token: newToken });

      // Thực hiện lại yêu cầu API
      await sendRequest(apiUrl, data);
      return;
    } else {
      alert("Token không hợp lệ hoặc không tồn tại");
      return;
    }
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(apiUrl, requestOptions);
  return response.json();
}
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ số 0, nên cần cộng thêm 1.
const year = currentDate.getFullYear();
const formattedDate = `${day}/${month}/${year}`;
// Hàm thực hiện khi nhấn nút "Submit"
submitButton.addEventListener("click", async () => {
  const name = inputName.value;
  console.log(name);
  if (name !== "") {
    // Lấy giá trị từ các trường nhập liệu
    const description = inputDescription.value;
    const address = inputOfficeAddress.value;
    const email = inputEmail.value;
    const phone = inputPhone.value;
    // Tạo đối tượng dữ liệu để gửi đến API endpoint
    const data = {
      customer: {
        CUSTOMER_NAME: name,
        CUSTOMER_DESCRIPTION: description,
        TELEPHONE: phone,
        OFFICE_ADDRESS: address,
        CUSTOMER_EMAIL: email,
        CUSTOMER_FOUNDING: formattedDate,
        TAX_CODE: "",
        CUSTOMER_OWNER: "",
      },
    };
    console.log(data);
    const apiUrl = "http://localhost:8180/crm/crm_token/api/v1/customers/add";

    try {
      // Gửi yêu cầu API
      const response = await sendRequest(apiUrl, data);
      console.log(response);

      alert("Thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi yêu cầu API");
    }
  }

  // Ẩn modal và ẩn nút "Edit"
  modal.style.display = "none";
  editButton.style.display = "none";
});

// Tạo phần tử HTML cho nút "Edit"
editButton = document.createElement("button");
editButton.innerText = "Add";
editButton.setAttribute("id", "edit-button");
editButton.style.display = "none";
editButton.style.position = "absolute";
editButton.style.backgroundColor = "#4CAF50"; // Đặt màu nền
editButton.style.color = "white"; // Đặt màu chữ
editButton.style.zIndex = "9999";
document.body.appendChild(editButton);

// Tạo phần tử HTML cho nút "Assign To"
assignButton = document.createElement("button");
assignButton.innerText = "Assign To";
assignButton.setAttribute("id", "assign-button");
assignButton.style.display = "none";
assignButton.style.position = "absolute";
assignButton.style.backgroundColor = "#008CBA"; // Đặt màu nền
assignButton.style.color = "white"; // Đặt màu chữ
assignButton.style.zIndex = "9999";
document.body.appendChild(assignButton);

// Đăng ký sự kiện "click" cho nút "Edit"
editButton.addEventListener("click", (event) => {
  event.stopPropagation(); // ngăn chặn sự kiện "click" lan ra tài liệu
  modal.style.display = "block";
  // Điền nội dung đã chọn vào các trường nhập liệu của modal
  inputName.value = selection.toString();
  // Thêm nút "Submit" vào modal
  modal.appendChild(submitButton);
  // Ẩn nút "Edit"
  editButton.style.display = "none";
});

//Thêm sự kiện double click cho văn bản
document.addEventListener("dblclick", (event) => {
  selection = window.getSelection();
  if (selection.toString().length > 0) {
    event.preventDefault(); // ngăn chặn menu chuột phải mặc định xuất hiện
    // Hiển thị nút "Edit" và nút "Assign To" tại vị trí chuột phải
    editButton.style.display = "block";
    editButton.style.top = event.pageY + "px";
    editButton.style.left = event.pageX + "px";
    assignButton.style.display = "block";
    assignButton.style.top = event.pageY + "px";
    assignButton.style.left = event.pageX + 50 + "px"; // sửa lại giá trị left
  }
});

document.addEventListener("mouseup", (event) => {
  console.log("vào mouseup");
  if (event.button === 0) {
    // Nếu là nút trái
    selection = window.getSelection();
    if (selection.toString().length > 0) {
      event.preventDefault(); // ngăn chặn menu chuột phải mặc định xuất hiện
      // Hiển thị nút "Edit" và nút "Assign To" tại vị trí chuột phải
      editButton.style.display = "block";
      console.log(1);
      editButton.style.top = event.pageY + "px";
      editButton.style.left = event.pageX + "px";
      assignButton.style.display = "block";
      console.log(2);
      assignButton.style.top = event.pageY + "px";
      assignButton.style.left = event.pageX + 50 + "px"; // sửa lại giá trị left
    }
  }
});

document.addEventListener("click", (event) => {
  // Ẩn nút "Edit" và nút "Assign To" khi người dùng nhấp chuột bên ngoài đoạn văn bản đã chọn
  editButton.style.display = "none";
  assignButton.style.display = "none";
});

document.addEventListener("click", (event) => {
  editButton = document.querySelector("#edit-button");
  assignButton = document.querySelector("#assign-button");
  if (editButton && !editButton.contains(event.target)) {
    // Ẩn nút "Edit"
    editButton.style.display = "none";
  }
  if (assignButton && !assignButton.contains(event.target)) {
    // Ẩn nút "Assign To"
    assignButton.style.display = "none";
  }
});

// Tạo modal
let modalAssignto = document.createElement("div");
// Tạo một modal popup

modalAssignto.style.display = "none";
modalAssignto.style.position = "fixed";
modalAssignto.style.zIndex = "9999";
modalAssignto.style.width = "400px";
modalAssignto.style.height = "600px";
modalAssignto.style.top = "50px";
modalAssignto.style.left = "50%";
modalAssignto.style.marginTop = "0px";
modalAssignto.style.marginLeft = "-200px";
modalAssignto.style.border = "1px solid black";
modalAssignto.style.backgroundColor = "white";
modalAssignto.style.padding = "20px";
modalAssignto.classList.add("modal");

// Tạo nội dung cho modal
let modalContent = document.createElement("div");
modalContent.classList.add("modal-content");

// Tạo form cho modal
let form = document.createElement("form");
// Tạo phần tử h2 để chứa tiêu đề
let titleForm = document.createElement("h2");
titleForm.innerHTML = "Thêm mới Giao dịch";

// Thêm tiêu đề vào modal
form.appendChild(titleForm);
// Tạo trường tên giao dịch
let transactionName = document.createElement("input");
transactionName.setAttribute("type", "text");
transactionName.setAttribute("placeholder", "Tên giao dịch");
transactionName.setAttribute("name", "TRANSACTION_NAME");
transactionName.style.marginBottom = "10px";
transactionName.style.width = "100%";
let labelTransactionName = document.createElement("label");
labelTransactionName.innerHTML = "Tên giao dịch:";
labelTransactionName.setAttribute("for", "TRANSACTION_NAME");
labelTransactionName.appendChild(transactionName);
form.appendChild(labelTransactionName);

// Tạo trường ngày bắt đầu
let inputStartDate = document.createElement("input");
inputStartDate.setAttribute("type", "type=datetime-local");
inputStartDate.setAttribute("name", "START_DATE");
inputStartDate.setAttribute("id", "start-date"); // định nghĩa ID cho phần tử input
inputStartDate.style.marginBottom = "10px";
inputStartDate.style.width = "100%";
let labelStartDate = document.createElement("label");
labelStartDate.innerHTML = "Ngày bắt đầu:";
labelStartDate.setAttribute("for", "start-date"); // sử dụng ID của phần tử input
labelStartDate.appendChild(inputStartDate);
form.appendChild(labelStartDate);

// Tạo trường hạn hoàn thành
let inputEndDate = document.createElement("input");
inputEndDate.setAttribute("type", "type=datetime-local");
inputEndDate.setAttribute("name", "END_DATE");
inputEndDate.setAttribute("id", "end-date"); // định nghĩa ID cho phần tử input
inputEndDate.style.marginBottom = "10px";
inputEndDate.style.width = "100%";
let labelEndDate = document.createElement("label");
labelEndDate.innerHTML = "Hạn hoàn thành:";
labelEndDate.setAttribute("for", "end-date"); // sử dụng ID của phần tử input
labelEndDate.appendChild(inputEndDate);
form.appendChild(labelEndDate);

// Tạo trường giao việc cho
let inputAssignTo = document.createElement("input");
inputAssignTo.setAttribute("type", "text");
inputAssignTo.setAttribute("placeholder", "Giao việc cho");
inputAssignTo.setAttribute("name", "TRANSACTION_USER");
inputAssignTo.style.marginBottom = "10px";
inputAssignTo.style.width = "100%";
let labelAssignTo = document.createElement("label");
labelAssignTo.innerHTML = "Giao việc cho:";
labelAssignTo.setAttribute("for", "TRANSACTION_USER");
labelAssignTo.appendChild(inputAssignTo);
form.appendChild(labelAssignTo);

// Tạo trường loại giao dịch
let selectTransactionType = document.createElement("select");
selectTransactionType.setAttribute("name", "TRANSACTION_TYPE_ID");
selectTransactionType.style.marginBottom = "10px";
selectTransactionType.style.width = "100%";
let optionBuy = document.createElement("option");
optionBuy.setAttribute("value", "1");
optionBuy.innerHTML = "Mua";
let optionSell = document.createElement("option");
optionSell.setAttribute("value", "2");
optionSell.innerHTML = "Bán";
selectTransactionType.appendChild(optionBuy);
selectTransactionType.appendChild(optionSell);
let labelTransactionType = document.createElement("label");
labelTransactionType.innerHTML = "Loại giao dịch:";
labelTransactionType.setAttribute("for", "TRANSACTION_TYPE_ID");
labelTransactionType.appendChild(selectTransactionType);
form.appendChild(labelTransactionType);

// Tạo trường mức ưu tiên
let selectPriority = document.createElement("select");
selectPriority.setAttribute("name", "PRIORITY");
selectPriority.style.marginBottom = "10px";
selectPriority.style.width = "100%";
let optionLow = document.createElement("option");
optionLow.setAttribute("value", "1");
optionLow.innerHTML = "1";
let optionMedium = document.createElement("option");
optionMedium.setAttribute("value", "2");
optionMedium.innerHTML = "2";
let optionHigh = document.createElement("option");
optionHigh.setAttribute("value", "3");
optionHigh.innerHTML = "3";
selectPriority.appendChild(optionLow);
selectPriority.appendChild(optionMedium);
selectPriority.appendChild(optionHigh);
let labelPriority = document.createElement("label");
labelPriority.innerHTML = "Mức ưu tiên:";
labelPriority.setAttribute("for", "PRIORITY");
labelPriority.appendChild(selectPriority);
form.appendChild(labelPriority);

//Tạo trường khách hàng

let customerButton = document.createElement("button");
customerButton.innerHTML = "Khách hàng";
customerButton.setAttribute("type", "button"); // thay đổi type thành "button"
customerButton.setAttribute("name", "CUSTOMER_ID");
customerButton.style.marginBottom = "10px";
customerButton.style.width = "100%";
let labelCustomer = document.createElement("label");
labelCustomer.setAttribute("for", "CUSTOMER_ID");
labelCustomer.appendChild(customerButton);
form.appendChild(labelCustomer);

let selectedCustomer = null;

function handleCustomerSelection(customerId) {
  selectedCustomer = findCustomerById(customerId);
  inputCustomerId.value = selectedCustomer.CUSTOMER_CODE;
  inputCustomerName.value = selectedCustomer.CUSTOMER_NAME;
  inputCustomerPhone.value = selectedCustomer.TELEPHONE;
  if (!customerInfo.parentNode) {
    form.appendChild(customerInfo);
  }
}

// customerButton.addEventListener("click", handleCustomerSelection());

let customerInfo = document.createElement("div");
customerInfo.className = "customer-info";

let labelCustomerId = document.createElement("label");
labelCustomerId.innerHTML = "Mã khách hàng:";
labelCustomerId.style.display = "inline-block";
labelCustomerId.style.width = "30%";
let inputCustomerId = document.createElement("input");
inputCustomerId.setAttribute("type", "text");
inputCustomerId.setAttribute("name", "CUSTOMER_ID");
inputCustomerId.setAttribute("readonly", true);
inputCustomerId.style.display = "inline-block";
inputCustomerId.style.width = "70%";
inputCustomerId.value = selectedCustomer ? selectedCustomer.CUSTOMER_CODE : "";
customerInfo.appendChild(labelCustomerId);
customerInfo.appendChild(inputCustomerId);

let labelCustomerName = document.createElement("label");
labelCustomerName.innerHTML = "Tên khách hàng:";
labelCustomerName.style.display = "inline-block";
labelCustomerName.style.width = "30%";
let inputCustomerName = document.createElement("input");
inputCustomerName.setAttribute("type", "text");
inputCustomerName.setAttribute("name", "CUSTOMER_NAME");
inputCustomerName.setAttribute("readonly", true);
inputCustomerName.style.display = "inline-block";
inputCustomerName.style.width = "70%";
inputCustomerName.value = selectedCustomer ? selectedCustomer.CUSTOMER_NAME : "";

customerInfo.appendChild(labelCustomerName);
customerInfo.appendChild(inputCustomerName);

let labelCustomerPhone = document.createElement("label");
labelCustomerPhone.innerHTML = "Số điện thoại:";
labelCustomerPhone.style.display = "inline-block";
labelCustomerPhone.style.width = "30%";
let inputCustomerPhone = document.createElement("input");
inputCustomerPhone.setAttribute("type", "text");
inputCustomerPhone.setAttribute("name", "CUSTOMER_PHONE");
inputCustomerPhone.setAttribute("readonly", true);
inputCustomerPhone.style.display = "inline-block";
inputCustomerPhone.style.width = "70%";
inputCustomerPhone.value = selectedCustomer ? selectedCustomer.TELEPHONE : "";
customerInfo.appendChild(labelCustomerPhone);
customerInfo.appendChild(inputCustomerPhone);

form.appendChild(customerInfo);
// Tạo phần tử chứa nút đóng và nút lưu
let buttonsContainer = document.createElement("div");
buttonsContainer.style.clear = "both"; // Theo dõi đoạn mã này

// Tạo nút đóng modal
let closeBtn = document.createElement("button");
closeBtn.style = "margin-top: 20px;float: right"; // Theo dõi đoạn mã này
closeBtn.classList.add("close");
closeBtn.innerHTML = "Đóng";
buttonsContainer.appendChild(closeBtn);

// Tạo nút lưu
let submitBtn = document.createElement("button");
submitBtn.style = "margin-top: 20px;float: right";
submitBtn.setAttribute("type", "submit");
submitBtn.innerHTML = "Lưu";
buttonsContainer.appendChild(submitBtn);

// Thêm phần tử chứa nút đóng và nút lưu vào form
form.appendChild(buttonsContainer);

// Thêm form vào phần tử modalContent
modalContent.appendChild(form);

// Thêm nội dung của modal vào modal
modalAssignto.appendChild(modalContent);

// Thêm modal vào body
document.body.appendChild(modalAssignto);

// Xử lý sự kiện khi người dùng nhấp vào nút đóng
closeBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Theo dõi đoạn mã này
  modalAssignto.style.display = "none";
});
// Xử lý sự kiện khi người dùng nhấn phím ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    modalAssignto.style.display = "none";
  }
});

// Đăng ký sự kiện "click" cho nút "Assgito"
assignButton.addEventListener("click", (event) => {
  event.stopPropagation(); // ngăn chặn sự kiện "click" lan ra tài liệu
  // Lấy giá trị ngày tháng hiện tại
  const currentDate = new Date();

  // Định dạng lại giá trị ngày tháng
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  // Gán giá trị vào trường startDate
  const startDateField = document.querySelector("#start-date");
  if (startDateField) {
    startDateField.value = formattedDate;
  }

  // Gán giá trị vào trường endDate
  const endDateField = document.querySelector("#end-date");
  if (endDateField) {
    endDateField.value = formattedDate;
  }

  modalAssignto.style.display = "block";
  // Điền nội dung đã chọn vào các trường nhập liệu của modal
  transactionName.value = selection.toString();
  // Thêm nút "Submit" vào modal
  modalAssignto.appendChild(submitBtn);
  // Ẩn nút "Edit"
  assignButton.style.display = "none";
});

// Xử lý sự kiện khi người dùng nhấp vào nút Submit
submitBtn.addEventListener("click", async function (event) {
  // Ngăn chặn hành động mặc định của nút Submit
  event.preventDefault();

  // Lấy tham chiếu đến form
  let form = document.querySelector("form");

  // Tạo đối tượng FormData và thêm dữ liệu từ form vào
  let formData = new FormData(form);

  formData.append("TRANSACTION_USER", "1");
  formData.append("CUSTOMER_ID", customerID);
  formData.append("CUSTOMER_OWNER", "1");
  // formData.append('TRANSACTION_TYPE_ID', '1');
  formData.append("STATUS", "1");
  formData.append("USER_ID", "2");
  formData.append("DATE_ALERT", "2");
  formData.append("TRANSACTION_RESULT", "Test 1123");

  const token = await isTokenValid();
  // Gọi API bằng phương thức fetch
  fetch("http://localhost:8180/crm/crm_token/api/v1/transaction/add", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(function (response) {
      // Xử lý kết quả trả về từ API
      if (response.ok) {
        alert("Thêm mới thành công !");
        return response.json();
      }
      throw new Error("chưa thành công");
    })
    .then(function (data) {
      console.log(data);
      // Ẩn modal
      modalAssignto.style.display = "none";
    })
    .catch(function (error) {
      // Xử lý lỗi khi gọi API
      console.log(error.message);
    });
  // Convert đối tượng FormData sang JSON
  let formDataJson = JSON.stringify(Object.fromEntries(formData.entries()));

  // In dữ liệu thành JSON
  console.log(formDataJson);
  // Ẩn modal
});

// Tạo các phần tử HTML cần thiết cho modal "Customer"
let customerModal = document.createElement("div");

customerModal.style.display = "none";
customerModal.style.position = "fixed";
customerModal.style.zIndex = "9999";
customerModal.style.width = "600px";
customerModal.style.height = "800px";
customerModal.style.top = "50%";
customerModal.style.left = "50%";
customerModal.style.marginTop = "-150px";
customerModal.style.marginLeft = "-200px";
customerModal.style.border = "1px solid black";
customerModal.style.backgroundColor = "white";
customerModal.style.padding = "20px";
customerModal.classList.add("modal");

customerModal.setAttribute("id", "customerModal");
customerModal.classList.add("modal");

let modalCustomerContent = document.createElement("div");
modalCustomerContent.classList.add("modal-content");

// Tạo nút đóng cho customerModal
let closeBtnCustomer = document.createElement("span");
closeBtnCustomer.classList.add("close");
closeBtnCustomer.textContent = "×";
customerModal.appendChild(closeBtnCustomer);

// Thêm sự kiện click vào nút đóng của customerModal
closeBtnCustomer.addEventListener("click", function () {
  customerModal.style.display = "none";
});

let modalHeader = document.createElement("h2");
modalHeader.textContent = "Thông tin khách hàng";

// Tạo các input cho từng thông tin tìm kiếm
let keywordInput = document.createElement("input");
keywordInput.setAttribute("type", "text");
keywordInput.setAttribute("id", "keyword");
keywordInput.setAttribute("placeholder", "Từ khóa");

let searchBtn = document.createElement("button");
searchBtn.textContent = "Search";

let customerTable = document.createElement("table");
customerTable.setAttribute("id", "customerTable");

// Thêm các phần tử vào modal-content
modalCustomerContent.appendChild(closeBtnCustomer);
modalCustomerContent.appendChild(modalHeader);
modalCustomerContent.appendChild(keywordInput);

modalCustomerContent.appendChild(searchBtn);
modalCustomerContent.appendChild(customerTable);

// Thêm modal-content vào modal
customerModal.appendChild(modalCustomerContent);

// Thêm modal vào DOM
document.body.appendChild(customerModal);

// Thêm sự kiện click vào customerButton
customerButton.addEventListener("click", function () {
  customerModal.style.display = "block";
});

async function searchCustomers(keyword) {
  let url = "http://localhost:8180/crm/crm_token/api/v1/find/customers";

  if (keyword) {
    url += `?keyword=${keyword}`;
  }
  const token = await isTokenValid();
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

let matchedCustomers;
searchBtn.addEventListener("click", function () {
  let keyword = document.getElementById("keyword").value;

  searchCustomers(keyword)
    .then((customers) => {
      console.log(customers);
      // Lưu trữ danh sách khách hàng phù hợp vào biến

      let responseData = customers.customers;
      matchedCustomers = Object.values(responseData);
      showCustomersTable(matchedCustomers);
    })
    .catch((error) => {
      // Xử lý lỗi
      console.error(error);
    });
});
// Tìm đối tượng khách hàng trong danh sách khách hàng
function findCustomerById(customerId) {
  let customerIdInt = parseInt(customerId);
  let customer = matchedCustomers.find((customer) => customer.CUSTOMER_ID === customerIdInt);
  if (customer === undefined) {
    console.log("Không tìm thấy khách hàng với mã " + customerId);
  }
  return customer;
}

let customerID;
function showCustomersTable(customerArray) {
  // Lấy phần tử chứa bảng khách hàng
  let customerTable = document.getElementById("customerTable");

  // Xóa các phần tử cũ trong phần tử chứa bảng khách hàng
  customerTable.innerHTML = "";

  // Kiểm tra xem customerArray có tồn tại hay không
  if (!customerArray || customerArray.length === 0) {
    let emptyTableMessage = document.createElement("p");
    emptyTableMessage.textContent = "Không có dữ liệu khách hàng";
    customerTable.appendChild(emptyTableMessage);
    return;
  }

  // Tạo hàng tiêu đề của bảng
  let tableHeaderRow = document.createElement("tr");
  let codeHeader = document.createElement("th");
  codeHeader.textContent = "Mã khách hàng";
  let nameHeader = document.createElement("th");
  nameHeader.textContent = "Tên Khách hàng";
  let ownerHeader = document.createElement("th");
  ownerHeader.textContent = "Chủ sở hữu";
  let phoneHeader = document.createElement("th");
  phoneHeader.textContent = "Số điện thoại";
  let createdDateHeader = document.createElement("th");
  createdDateHeader.textContent = "Ngày tạo";
  tableHeaderRow.appendChild(codeHeader);
  tableHeaderRow.appendChild(nameHeader);
  tableHeaderRow.appendChild(ownerHeader);
  tableHeaderRow.appendChild(phoneHeader);
  tableHeaderRow.appendChild(createdDateHeader);
  customerTable.appendChild(tableHeaderRow);

  // Duyệt qua danh sách khách hàng và tạo các phần tử HTML để hiển thị thông tin khách hàng
  let customers = customerArray.slice(0, 5);
  customers.forEach(function (customer) {
    let customerRow = document.createElement("tr");
    customerRow.setAttribute("data-customer-id", customer.CUSTOMER_ID);

    let customerCode = document.createElement("td");
    customerCode.textContent = customer.CUSTOMER_CODE;
    customerRow.appendChild(customerCode);

    let customerName = document.createElement("td");
    customerName.textContent = customer.CUSTOMER_NAME;
    customerRow.appendChild(customerName);

    let customerOwner = document.createElement("td");
    customerOwner.textContent = customer.CUSTOMER_OWNER;
    customerRow.appendChild(customerOwner);

    let customerPhone = document.createElement("td");
    customerPhone.textContent = customer.TELEPHONE_DITGITS;
    customerRow.appendChild(customerPhone);

    let customerCreatedDate = document.createElement("td");
    customerCreatedDate.textContent = customer.REG_DTTM;
    customerRow.appendChild(customerCreatedDate);

    customerTable.appendChild(customerRow);
  });

  // Đăng ký sự kiện click cho từng dòng trong bảng
  let rows = customerTable.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("dblclick", function () {
      // Lấy ra customerID của khách hàng tương ứng
      customerID = this.getAttribute("data-customer-id");
      //   selectedCustomer = findCustomerById(customerID);
      handleCustomerSelection(customerID);
      customerModal.style.display = "none";
    });
  }
}

// tạo MD5 thay bằng thư viện
var MD5 = function (string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x, y, z) {
    return (x & y) | (~x & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & ~z);
  }
  function H(x, y, z) {
    return x ^ y ^ z;
  }
  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function WordToHex(lValue) {
    var WordToHexValue = "",
      WordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue =
        WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }

  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

  return temp.toLowerCase();
};
