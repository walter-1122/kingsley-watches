const PRODUCTS = [
  {id:"classic", name:"Kingsley Classic", price:129, category:"Classic", image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85", desc:"A restrained everyday silhouette with a timeless presence."},
  {id:"heritage", name:"Kingsley Heritage", price:159, category:"Heritage", image:"https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=85", desc:"A vintage-inspired profile interpreted with a clean modern eye."},
  {id:"noir", name:"Kingsley Noir", price:179, category:"Signature", image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85", desc:"Dark, understated and built around a quietly confident dial."},
  {id:"royale", name:"Kingsley Royale", price:199, category:"Signature", image:"https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?auto=format&fit=crop&w=900&q=85", desc:"A more formal expression for evenings, occasions and milestones."}
];

const money = n => "$" + Number(n).toFixed(2);
const getCart = () => JSON.parse(localStorage.getItem("kingsley-cart") || "[]");
const saveCart = cart => { localStorage.setItem("kingsley-cart", JSON.stringify(cart)); updateCartCount(); };
function updateCartCount(){ const el=document.getElementById("cart-count"); if(el) el.textContent=getCart().reduce((s,i)=>s+i.qty,0); }

function productCard(p){
  return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"></a><div class="product-info"><div><p class="product-category">${p.category}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3></div><strong>${money(p.price)}</strong></div><button class="quick-add" data-add="${p.id}">Add to cart</button></article>`;
}

function renderProducts(id, limit){
  const el=document.getElementById(id); if(!el) return;
  let list=[...PRODUCTS];
  if(limit) list=list.slice(0,limit);
  el.innerHTML=list.map(productCard).join("");
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add)));
}

function addToCart(id){
  const cart=getCart(); const found=cart.find(x=>x.id===id);
  if(found) found.qty++; else cart.push({id,qty:1});
  saveCart(cart); showToast("Added to cart");
}
function showToast(msg){
  let t=document.querySelector(".toast"); if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t);}
  t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);
}

function renderProduct(){
  const el=document.getElementById("product-detail"); if(!el)return;
  const id=new URLSearchParams(location.search).get("id")||"classic";
  const p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
  el.innerHTML=`<div class="detail-image"><img src="${p.image}" alt="${p.name}"></div><div class="detail-copy"><p class="eyebrow">${p.category}</p><h1>${p.name}</h1><div class="detail-price">${money(p.price)}</div><p class="lead">${p.desc}</p><div class="specs"><div><span>Style</span><strong>${p.category}</strong></div><div><span>Availability</span><strong>In stock</strong></div><div><span>Order</span><strong>Cash on delivery</strong></div></div><button class="btn btn-dark full" id="add-detail">Add to cart</button><a class="text-link" href="contact.html">Questions about this piece? →</a></div>`;
  document.getElementById("add-detail").onclick=()=>addToCart(p.id);
}

function renderCart(){
  const el=document.getElementById("cart-items"); if(!el)return;
  const cart=getCart();
  if(!cart.length){el.innerHTML=`<div class="empty"><p class="eyebrow">YOUR CART</p><h2>Nothing here yet.</h2><p>Explore the collection and find a piece that feels like yours.</p><a class="btn btn-dark" href="shop.html">Explore collection</a></div>`;return;}
  let total=0;
  el.innerHTML=cart.map(item=>{const p=PRODUCTS.find(x=>x.id===item.id);const line=p.price*item.qty;total+=line;return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><p class="product-category">${p.category}</p><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty"><button data-minus="${p.id}">−</button><span>${item.qty}</span><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">Remove</button></div></div><strong>${money(line)}</strong></div>`}).join("");
  const totalEl=document.getElementById("cart-total");if(totalEl)totalEl.textContent=money(total);
  document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));
  document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));
  document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeItem(b.dataset.remove));
}
function changeQty(id,delta){let c=getCart(),x=c.find(i=>i.id===id);if(x){x.qty+=delta;if(x.qty<1)c=c.filter(i=>i.id!==id)}saveCart(c);renderCart();}
function removeItem(id){saveCart(getCart().filter(i=>i.id!==id));renderCart();}

function renderCheckout(){
  const el=document.getElementById("checkout-items");if(!el)return;
  const cart=getCart();let total=0;
  el.innerHTML=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);total+=p.price*i.qty;return `<div class="summary-row"><span>${p.name} × ${i.qty}</span><strong>${money(p.price*i.qty)}</strong></div>`}).join("");
  const t=document.getElementById("checkout-total");if(t)t.textContent=money(total);
  const form=document.getElementById("checkout-form");
  if(form)form.onsubmit=e=>{e.preventDefault();if(!cart.length){alert("Your cart is empty.");return;}alert("Order captured in demo mode. Connect this form to your real order backend or email service before launch.");localStorage.removeItem("kingsley-cart");location.href="index.html";};
}

function init(){
  updateCartCount(); renderProducts("featured-products",3); renderProducts("shop-products");
  renderProduct(); renderCart(); renderCheckout();
  const sort=document.getElementById("sort");
  if(sort)sort.onchange=()=>{const el=document.getElementById("shop-products");let list=[...PRODUCTS];if(sort.value==="low")list.sort((a,b)=>a.price-b.price);if(sort.value==="high")list.sort((a,b)=>b.price-a.price);el.innerHTML=list.map(productCard).join("");document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(b.dataset.add));};
  const total=document.getElementById("product-total");if(total)total.textContent=`${PRODUCTS.length} timepieces`;
  document.querySelector(".menu-btn")?.addEventListener("click",()=>document.body.classList.toggle("menu-open"));
}
document.addEventListener("DOMContentLoaded",init);