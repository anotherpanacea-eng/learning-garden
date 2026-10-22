// Original setting reminders. No basket/flag quantities, clock times or distances.
export function windowReminder(id){
 const opening='<svg viewBox="0 0 320 110" aria-hidden="true" focusable="false"><path d="M10 96H310" fill="none" stroke="#9caf9f" stroke-width="2"/>';
 const scenes={
  baskets:'<path d="M26 50L78 22l52 28M38 50v44h80V50" fill="#e4ecd9" stroke="#245447" stroke-width="3"/><path d="M190 51h90v43h-90z" fill="#eee3c5" stroke="#245447" stroke-width="3"/><path d="M180 51l13-22h83l14 22z" fill="#e7b75a" stroke="#245447" stroke-width="3"/><path d="M200 51v43m70-43v43" fill="none" stroke="#245447" stroke-width="3"/><path d="M142 21l-6 12m19-8l-6 12m19-6l-6 12" stroke="#7a9eae" stroke-width="3"/>',
  flags:'<path d="M22 95h276M22 70q138-77 276 0M22 78q138-77 276 0M22 70v25M298 70v25" fill="none" stroke="#245447" stroke-width="3"/><path d="M130 18q30-23 60 0v16h-60z" fill="#e7b75a" stroke="#245447" stroke-width="3"/><path d="M125 35h70m-37 1v7" stroke="#245447" stroke-width="3"/><path d="M42 103q17-10 34 0t34 0m84 0q17-10 34 0t34 0" fill="none" stroke="#7a9eae" stroke-width="2"/>',
  sign:'<path d="M155 20h18v76h-18z" fill="#c9b891" stroke="#245447" stroke-width="3"/><path d="M100 16h127v46H100z" fill="#eee3c5" stroke="#245447" stroke-width="3"/><path d="M30 94q-24-18 2-30-8-26 20-22 18-20 32 4 31-1 19 26 24 18-5 22z" fill="#b8cba3" stroke="#245447" stroke-width="3"/><path d="M235 96l22-33 42 33" fill="none" stroke="#7a9eae" stroke-width="3"/>'
 };
 return `<div class="windows-reminder">${opening}${scenes[id]||'<path d="M48 20h80v74H48zM192 20h80v74h-80zM88 20v74m-40-37h80m104-37v74m-40-37h80" fill="#e4ecd9" stroke="#245447" stroke-width="3"/>'}</svg><span>Picture reminder only. The numbered passages supply the story details.</span></div>`;
}
