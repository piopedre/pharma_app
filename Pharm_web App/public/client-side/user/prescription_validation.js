// DOM Elements
const $datetimePrescription = document.querySelector(".datetime__prescription");
const $deleteButtons = document.querySelectorAll(".delete__button");
const $drugCart = document.querySelector(".drug__content-items");
const $drugItems = document.querySelectorAll(".drug__content-item");
const $emptyContainer = document.querySelector(".empty__drug__cart");

// functions
function deleteDrugItem(e, index) {
  console.log(index);
  // remove the element
  e.target.parentElement.remove();
}
const cartEmpty = () => {
  if (!$drugItems.length) {
    $emptyContainer.classList.remove("remove");
    return;
  }
  $emptyContainer.classList.add("remove");
};
// event listeners
$deleteButtons.forEach(function (button, index) {
  button.addEventListener("click", function (e) {
    deleteDrugItem(e, index);
  });
});
window.addEventListener("DOMContentLoaded", cartEmpty);

//  <li class="drug__content-item">
//    <div>
//      <p class="drug-dosage__form">Tab</p>
//    </div>
//    <div class="drug__name-container">
//      <p class="drug__name">Atorvastatin</p>
//    </div>
//    <div>
//      <p class="drug_strength">2mg</p>
//    </div>
//    <div>
//      <input class="drug_quantity" value="5" />
//    </div>
//    <div>
//      <p class="drug__price">230</p>
//    </div>
//    <div>
//      <p class="drug__drug_amount">1150</p>
//    </div>
//    <button class="delete__button">delete</button>
//  </li>;
