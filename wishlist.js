let wishList = [];

function setup() 
{
    let products = document.querySelectorAll(".but");
    for (let i = 0; i < products.length; i++)
    {
        products[i].onclick = function(e) {
            addItem(e);
        }
    }
}

function addItem (e) {
    let productId = e.target.getAttribute("id");
    if(!wishList.find(element => element === productId)){
        let productDiv = document.getElementById("product" + productId);

        let wishDiv = document.createElement("div");
        wishDiv.setAttribute("id", "wish" + productId);
        wishDiv.setAttribute("class", "product");
        wishDiv.setAttribute("style", "margin-bottom: 10px;")
        wishDiv.innerHTML += productDiv.innerHTML;
        let removeBtn = document.createElement("input");
        removeBtn.setAttribute("id", "remove" + productId);
        removeBtn.setAttribute("type", "button");
        removeBtn.setAttribute("value", "Remove");
        // removeBtn.setAttribute("class", "removebut");
        removeBtn.onclick = () => removeItem(productId);
        wishDiv.appendChild(removeBtn);

        let aside = document.getElementById("wishlist");
        aside.appendChild(wishDiv);

        wishList.push(productId);
    }
}
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".but").forEach(function(button) {
        button.addEventListener("click", function() {
            const destinationId = this.getAttribute("id");
            const action = this.classList.contains("added") ? "remove" : "add";
            updateWishlist(destinationId, action, this);
        });
    });
});

function updateWishlist(destinationId, action, buttonElement) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "wishlist_handler.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        const response = JSON.parse(this.responseText);
        if (response.success) {
            if (action === "add") {
                buttonElement.classList.add("added");
                buttonElement.value = "Remove from List";
            } else {
                buttonElement.classList.remove("added");
                buttonElement.value = "Add to List";
            }
        } else {
            alert(response.error);
        }
    };
    xhr.send(`destination_id=${destinationId}&action=${action}`);
}


function removeItem(productId) {
    document.getElementById("wish" + productId).remove();
    wishList = wishList.filter(element => element !== productId)
}


window.addEventListener("load", setup);
