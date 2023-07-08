// functions for fundamentality
class ResponseError extends Error {
  constructor(message, res) {
    super(message);
    this.response = res;
  }
}
// send Request
async function sendReq(
  token,
  data,
  reqFunction,
  messageEl,
  successMessage,
  message400,
  message500
) {
  try {
    const response = await reqFunction(token, data);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    messageEl.style.backgroundColor = "#2bf712";
    messageEl.textContent = successMessage;
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = message400;
        break;
      case 401:
        location.replace("/pharma_app/login");
        break;
      case 500:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = message500;
        break;
    }
  }
}

async function getDatabase(token, reqFunction, location, unit, messageEl) {
  const response = await reqFunction(token, location, unit);
  try {
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Error, Fetching Database";
        break;
      case 401:
        messageEl.style.backgroundColor = "#c41a1a";
        location.replace("/pharma_app/login");
        break;
      case 404:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Database is empty";
        break;
      case 500:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = " error, connecting to server";
        break;
    }
  }
}
async function getSalesDatabase(
  token,
  reqFunction,
  location,
  unit,
  messageEl,
  pricing,
  startDate,
  endDate
) {
  const response = await reqFunction(
    token,
    location,
    unit,
    startDate,
    endDate,
    pricing
  );
  try {
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Error, Fetching Database";
        break;
      case 401:
        messageEl.style.backgroundColor = "#c41a1a";
        location.replace("/pharma_app/login");
        break;
      case 404:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Database is empty";
        break;
      case 500:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = " error, connecting to server";
        break;
    }
  }
}
async function getPatientDatabase(token, reqFunction, messageEl) {
  const response = await reqFunction(token);
  try {
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Error, Fetching Database";
        break;
      case 401:
        messageEl.style.backgroundColor = "#c41a1a";
        location.replace("/pharma_app/login");
        break;
      case 404:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Database is empty";
        break;
      case 500:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = " error, connecting to server";
        break;
    }
  }
}

async function altSendReq(
  data,
  reqFunction,
  messageEl,
  successMessage,
  message400,
  message500
) {
  try {
    const response = await reqFunction(data);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }

    messageEl.style.backgroundColor = "#2bf712";
    messageEl.textContent = successMessage;
    location.reload();
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = message400;
        break;
      case 401:
        location.replace("/pharma_app/admin/login");
        break;
      case 500:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = message500;
        break;
    }
  }
}
async function sendEditReq(token, reqFunction, id, data, messageEl) {
  try {
    const response = await reqFunction(token, id, data);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    messageEl.style.backgroundColor = "#3ff78f";
    messageEl.textContent = "Changes Saved";
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Error, Fetching Database";
        break;
      case 401:
        location.replace("/pharma_app/login");
        break;
      case 404:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Product does not exist";
        break;
      case 500:
        messageEl.style.backgroundColor = "#c41a1a";
        messageEl.textContent = "Problem, \n connecting to database";
        break;
    }
  }
}
// Register Admin
async function registerUser(data) {
  const response = await fetch("/admins/registration", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
// login Admin
async function loginUser(data) {
  const response = await fetch("/admins/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
  return response;
}

async function getProfile(token) {
  const response = await fetch(`/admins/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// get User Last Name

async function getAdmin(token, id) {
  const response = await fetch(`/admins/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
async function updateUser(token, data) {
  const response = await fetch(`/admins/update_user`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
async function updateAvatar(token, data) {
  const response = await fetch(`/admins/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return response;
}

//////////////////////////
///DRUGS///
async function addProduct(token, data) {
  const response = await fetch("/products/add_product", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
async function getAllProducts(
  token,
  location = undefined,
  pharmacyUnit = undefined
) {
  const response = await fetch(
    `/products/search?location=${location}&pharmacy_unit=${pharmacyUnit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
}

async function getProductById(token, id) {
  const response = await fetch(`/products/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  auth(response);
  return response;
}

async function editProductById(token, id, body) {
  const response = await fetch(`/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
async function deleteProductById(token, id) {
  const response = await fetch(`/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

///////////REQUISTION///////

async function requiste(token, body) {
  const response = await fetch("/requistion", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
async function getLastRequistion(token) {
  const response = await fetch("/last_requistion", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// product log
async function addProductLogs(token, body) {
  const response = await fetch("/productlogs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
async function getProductLogsByProduct(token, id) {
  const response = await fetch(`/productlogsbyproduct/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
///////////////////
// Product Category
async function categoryAdd(body) {
  const response = await fetch("/product/new_category", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
///////////////////
// Patient
async function addPatient(token, data) {
  const response = await fetch("/patients", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
async function getAllPatients(token) {
  const response = await fetch(`/patients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// Sales
async function addSale(token, data) {
  const response = await fetch("/productsales", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
async function getSales(
  token,
  location,
  pharmacyUnit,
  startDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`,
  endDate = new Date().setDate(new Date().getDate() + 1),
  pricing = "NORMAL"
) {
  const response = await fetch(
    `/productsales/search?pricing=${pricing}&location=${location}&unit=${pharmacyUnit}&end_date=${endDate}&start_date=${startDate}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
}
export {
  registerUser,
  loginUser,
  getProfile,
  addProduct,
  getAllProducts,
  getProductById,
  editProductById,
  deleteProductById,
  requiste,
  updateAvatar,
  ResponseError,
  updateUser,
  categoryAdd,
  sendReq,
  altSendReq,
  getDatabase,
  sendEditReq,
  getLastRequistion,
  addProductLogs,
  getProductLogsByProduct,
  addPatient,
  getAllPatients,
  getPatientDatabase,
  addSale,
  getSales,
  getSalesDatabase,
  getAdmin,
};
