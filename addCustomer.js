// Tạo một modal popup
let modal = document.createElement("div");
var boundingRect = modal.getBoundingClientRect();
console.log(boundingRect);
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
  }
});

document.addEventListener("mouseup", (event) => {
  console.log("vào mouseup");
  if (event.button === 0) {
    // Nếu là nút trái
    selection = window.getSelection();
    if (selection.toString().length > 0) {
      console.log(selection);
      event.preventDefault(); // ngăn chặn menu chuột phải mặc định xuất hiện
      // Hiển thị nút "Edit" và nút "Assign To" tại vị trí chuột phải
      editButton.style.display = "block";
      console.log(1);
      editButton.style.top = event.pageY + "px";
      editButton.style.left = event.pageX + "px";
    }
  }
});

document.addEventListener("click", (event) => {
  // Ẩn nút "Edit" và nút "Assign To" khi người dùng nhấp chuột bên ngoài đoạn văn bản đã chọn
  editButton.style.display = "none";
});
