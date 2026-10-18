import {ORDER_PERMUTATIONS,cleanOrder,orderValue} from './paris-pack-core.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function orderEditor(node,draft){
 const order=cleanOrder(draft.order),full=orderValue(order)!==null;
 return `<fieldset class="story-order"><legend>Tap the cards in story order.</legend><p class="tiny">Choose what happened first, then next, then last. You can remove a card and try a different place.</p><div class="order-card-bank" role="group" aria-label="Cards to put in order">${node.displayOrder.map(i=>`<button type="button" class="order-card" data-order-add="${i}" aria-describedby="order-status" aria-label="Place ${esc(node.orderItems[i])}" ${order.includes(i)?'disabled':''}>${esc(node.orderItems[i])}${order.includes(i)?'<span>In your order</span>':''}</button>`).join('')}</div><h3>Your order</h3><ol class="order-slots" aria-label="Your story order">${[0,1,2].map(position=>`<li>${order[position]!==undefined?`<span>${esc(node.orderItems[order[position]])}</span><button type="button" class="text-button" data-order-remove="${position}" aria-label="Remove ${esc(node.orderItems[order[position]])}">Remove</button>`:'<span class="order-empty">Choose a card for this spot.</span>'}</li>`).join('')}</ol><p class="tiny order-status" id="order-status" role="status" aria-live="polite">${full?'All three cards are in place. Try your order when you’re ready.':`${order.length} of 3 cards placed.`}</p><div class="order-actions"><button class="primary" type="submit" id="order-submit" aria-describedby="order-status" ${full?'':'disabled'}>Try this order</button><button class="text-button" type="button" id="order-clear" ${order.length?'':'disabled'}>Clear my order</button></div></fieldset>`;
}

export function orderResult(node,draft){
 const order=ORDER_PERMUTATIONS[draft.attempts.at(-1)];
 return order?`<section class="order-submitted"><h3>Your submitted order</h3><ol>${order.map(i=>`<li>${esc(node.orderItems[i])}</li>`).join('')}</ol></section>`:'';
}
