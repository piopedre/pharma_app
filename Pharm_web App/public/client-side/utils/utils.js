// functions for fundamentality
class ResponseError extends Error {
  constructor(message, res) {
    super(message);
    this.response = res;
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
async function addDrug(token, data) {
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
async function getAllDrugs(
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

async function getDrugById(token, id) {
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

async function editDrugById(token, id, body) {
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
async function deleteDrugById(token, id) {
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
export {
  registerUser,
  loginUser,
  getProfile,
  addDrug,
  getAllDrugs,
  getDrugById,
  editDrugById,
  deleteDrugById,
  requiste,
  updateAvatar,
  ResponseError,
  updateUser,
  categoryAdd,
};
