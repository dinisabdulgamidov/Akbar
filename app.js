// Каталог сейчас демонстрационный. Перед запуском замените список на подтверждённый ассортимент и цены магазина.
const products=[
{id:1,n:"Яблоки",c:"Овощи и фрукты",p:120,u:"кг",e:"🍎"},
{id:2,n:"Бананы",c:"Овощи и фрукты",p:140,u:"кг",e:"🍌"},
{id:3,n:"Картофель",c:"Овощи и фрукты",p:55,u:"кг",e:"🥔"},
{id:4,n:"Молоко",c:"Молочные продукты",p:95,u:"1 л",e:"🥛"},
{id:5,n:"Сыр",c:"Молочные продукты",p:390,u:"кг",e:"🧀"},
{id:6,n:"Рис",c:"Бакалея",p:110,u:"кг",e:"🍚"},
{id:7,n:"Макароны",c:"Бакалея",p:75,u:"уп.",e:"🍝"},
{id:8,n:"Сок",c:"Напитки",p:100,u:"1 л",e:"🧃"},
{id:9,n:"Шоколад",c:"Сладости",p:110,u:"шт.",e:"🍫"},
{id:10,n:"Печенье",c:"Сладости",p:85,u:"уп.",e:"🍪"},
{id:11,n:"Средство для посуды",c:"Бытовая химия",p:160,u:"шт.",e:"🧴"},
{id:12,n:"Мандарины",c:"Овощи и фрукты",p:180,u:"кг",e:"🍊"}
];
const WHATSAPP_PHONE="79288300707"; // WhatsApp магазина: +7 928 830-07-07
const cart=new Map();let cat="Все",query="";
const $=id=>document.getElementById(id),rub=n=>new Intl.NumberFormat("ru-RU").format(n)+" ₽";
function draw(){const list=products.filter(x=>(cat==="Все"||x.c===cat)&&x.n.toLowerCase().includes(query));$("products").innerHTML=list.map(x=>`<article class="product"><div class="product-visual"><span>${x.e}</span></div><small>${x.c}</small><h3>${x.n}</h3><div class="product-bottom"><strong>${rub(x.p)} <small>/ ${x.u}</small></strong><button class="add" data-add="${x.id}" aria-label="Добавить ${x.n} в корзину">+</button></div></article>`).join("");$("empty").hidden=!!list.length;$("catalogCount").textContent=list.length+" товаров"}
function sum(){return [...cart].reduce((s,[id,q])=>s+products.find(x=>x.id===id).p*q,0)}
function shipping(){return $("village").value!=="Нурадилово"&&sum()>0&&sum()<1000?150:0}
function drawCart(){const quantity=[...cart.values()].reduce((a,b)=>a+b,0);$("count").textContent=quantity;$("cartItemsCount").textContent="("+quantity+")";$("items").innerHTML=[...cart].map(([id,q])=>{const x=products.find(p=>p.id===id);return `<div class="cart-line"><div class="cart-emoji">${x.e}</div><div class="cart-line-info"><b>${x.n}</b><small>${rub(x.p)} / ${x.u}</small></div><div class="quantity"><button data-dec="${id}" aria-label="Уменьшить количество">−</button><span>${q}</span><button data-inc="${id}" aria-label="Увеличить количество">+</button></div></div>`}).join("")||'<div class="empty-cart"><span>🛍️</span>Корзина пока пуста.<br>Добавьте товары из каталога</div>';$("subtotal").textContent=rub(sum());$("shipping").textContent=shipping()?rub(shipping()):"Бесплатно";$("total").textContent=rub(sum()+shipping());$("checkout").disabled=!cart.size}
function toast(message){$("toast").textContent=message;$("toast").style.display="block";clearTimeout(toast.timer);toast.timer=setTimeout(()=>$("toast").style.display="none",2400)}
function openCart(){$("cart").classList.add("open");$("shade").hidden=false;document.body.style.overflow="hidden"}
function closeCart(){$("cart").classList.remove("open");$("shade").hidden=true;document.body.style.overflow=""}
$("products").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=+b.dataset.add;cart.set(id,(cart.get(id)||0)+1);drawCart();toast("Добавлено в корзину")});
$("filters").addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;cat=b.dataset.cat;document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x===b));draw()});
$("search").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();draw()});
$("items").addEventListener("click",e=>{const b=e.target.closest("[data-dec],[data-inc]");if(!b)return;const id=+(b.dataset.dec||b.dataset.inc),q=(cart.get(id)||0)+(b.dataset.inc?1:-1);if(q>0)cart.set(id,q);else cart.delete(id);drawCart()});
$("openCart").onclick=openCart;$("close").onclick=closeCart;$("shade").onclick=closeCart;$("village").onchange=drawCart;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("search").focus()}});
$("checkout").onclick=()=>{if(!cart.size)return;if(!/^\d{10,15}$/.test(WHATSAPP_PHONE)){toast("Нужно указать номер WhatsApp магазина");return}const lines=[...cart].map(([id,q])=>{const x=products.find(p=>p.id===id);return "• "+x.n+" — "+q+" × "+rub(x.p)+" = "+rub(x.p*q)});const message=["Здравствуйте! Хочу оформить заказ в АКБАР МАРКЕТ.","",""+lines.join("\n"),"","Село доставки: "+$("village").value,"Товары: "+rub(sum()),"Доставка: "+(shipping()?rub(shipping()):"Бесплатно"),"Итого: "+rub(sum()+shipping())].join("\n");window.open("https://wa.me/"+WHATSAPP_PHONE+"?text="+encodeURIComponent(message),"_blank","noopener")};
draw();drawCart();