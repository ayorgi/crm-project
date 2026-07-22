(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,51757,e=>{"use strict";let t=(0,e.i(56420).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["CheckCircle2",0,t],51757)},20865,e=>{"use strict";let t=(0,e.i(56420).default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",0,t],20865)},62368,e=>{"use strict";let t=(0,e.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["Download",0,t],62368)},66595,e=>{"use strict";let t=(0,e.i(56420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],66595)},26495,e=>{"use strict";let t=(0,e.i(56420).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["default",0,t])},16327,e=>{"use strict";var t=e.i(26495);e.s(["ChevronDown",()=>t.default])},46387,e=>{"use strict";let t=(0,e.i(56420).default)("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,t],46387)},63676,e=>{"use strict";let t=(0,e.i(56420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],63676)},72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},84028,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(22016),i=e.i(57688),r=e.i(26091),l=e.i(62368),n=e.i(51757),o=e.i(66595),d=e.i(72382),c=e.i(63676);let x=(0,e.i(56420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var p=e.i(20865),m=e.i(46387),f=e.i(16327),h=e.i(44457);let g={"VIP Business Van":150,"Executive Sedan":120,"Premium SUV":180,"Luxury Minibus":220,"First Class Sedan":160},b=e=>{if(!e)return 150;if(g[e])return g[e];for(let[t,a]of Object.entries(g))if(e.toLowerCase().includes(t.toLowerCase()))return a;return 150};e.s(["default",0,function(){let[e,g]=(0,a.useState)([]),[u,y]=(0,a.useState)(""),[v,w]=(0,a.useState)(null),[N,j]=(0,a.useState)(10);(0,a.useEffect)(()=>{let e=localStorage.getItem("currentCustomer")||"",t=JSON.parse(localStorage.getItem("customerProfile")||"{}"),a=e=>(e||"").replace(/\s+/g," ").trim().toLowerCase();g(JSON.parse(localStorage.getItem("customersDB")||"[]").filter(s=>{let i=a(`${s.firstName||""} ${s.lastName||""}`),r=a(s.firstName),l=a(s.email),n=a(e),o=a(`${t.firstName||""} ${t.lastName||""}`);a(t.firstName);let d=a(t.email);return!!d&&l===d||!!n&&(i===n||r===n||l===n)||!!o&&(i===o||r===o)}).filter(e=>"Cancelled"!==e.status))},[]);let k=e.filter(e=>e.pickupLocation?.toLowerCase().includes(u.toLowerCase())||e.dropoffLocation?.toLowerCase().includes(u.toLowerCase())||e.vehicleType?.toLowerCase().includes(u.toLowerCase())||e.transferDate?.includes(u));return(0,t.jsxs)("div",{className:"animate-in fade-in duration-300 pb-10",children:[(0,t.jsx)("div",{className:"mb-8",children:(0,t.jsxs)("div",{className:"flex flex-col md:flex-row md:items-end justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-4xl text-gray-900 font-heading font-bold tracking-tight flex items-center gap-3",children:"Receipts & Invoices"}),(0,t.jsx)("p",{className:"text-gray-500 mt-2 text-lg",children:"View and download official tax invoices for your VIP transfers."})]}),e.length>0&&(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(o.Search,{className:"w-4 h-4 text-gray-400 absolute left-3.5 top-3"}),(0,t.jsx)("input",{type:"text",placeholder:"Search receipts...",value:u,onChange:e=>y(e.target.value),className:"pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#aa2d29] transition-all w-64 shadow-sm"})]})]})}),0===k.length?(0,t.jsxs)("div",{className:"bg-white rounded-3xl shadow-soft p-12 flex flex-col items-center justify-center text-center",children:[(0,t.jsx)("div",{className:"w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4",children:(0,t.jsx)(r.FileText,{className:"w-10 h-10 text-blue-500"})}),(0,t.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-2",children:"No Receipts Found"}),(0,t.jsx)("p",{className:"text-gray-500 max-w-sm mb-6 text-lg",children:"Official invoices will appear here once your transfers are confirmed or completed."}),(0,t.jsx)(s.default,{href:"/portal/book",className:"bg-[#aa2d29] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#8e2622] transition-colors shadow-md",children:"Book a Transfer"})]}):(0,t.jsxs)("div",{className:"bg-white rounded-3xl shadow-soft overflow-hidden border border-transparent",children:[(0,t.jsxs)("div",{className:"p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50",children:[(0,t.jsxs)("span",{className:"text-xs font-bold text-gray-400 uppercase tracking-widest",children:["Total Receipts (",k.length,")"]}),(0,t.jsxs)("span",{className:"text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5",children:[(0,t.jsx)(n.CheckCircle2,{className:"w-3.5 h-3.5"})," All Verified"]})]}),(0,t.jsx)("div",{className:"divide-y divide-gray-100",children:k.slice(0,N).map(e=>(0,t.jsxs)("div",{className:"p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors",children:[(0,t.jsxs)("div",{className:"flex items-start gap-4",children:[(0,t.jsx)("div",{className:"w-12 h-12 rounded-2xl bg-rose-50 text-[#aa2d29] flex items-center justify-center shrink-0",children:(0,t.jsx)(r.FileText,{className:"w-6 h-6"})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-1",children:[(0,t.jsxs)("span",{className:"font-bold text-gray-900 text-lg",children:["Invoice #INV-",e.id]}),(0,t.jsx)("span",{className:"text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100",children:"Paid"})]}),(0,t.jsxs)("p",{className:"text-sm font-medium text-gray-600",children:[e.pickupLocation," ➔ ",e.dropoffLocation]}),(0,t.jsxs)("p",{className:"text-xs text-gray-400 mt-1 flex items-center gap-2",children:[(0,t.jsxs)("span",{children:["Date: ",e.transferDate]}),(0,t.jsxs)("span",{children:["• Vehicle: ",e.vehicleType]}),(0,t.jsxs)("span",{className:"font-bold text-gray-900",children:["• Price: $",b(e.vehicleType),".00 USD"]})]})]})]}),(0,t.jsx)("div",{className:"flex items-center gap-3 shrink-0 justify-end",children:(0,t.jsxs)("button",{onClick:()=>w(e),className:"flex items-center gap-2 px-5 py-2.5 bg-[#aa2d29] text-white rounded-xl text-sm font-bold hover:bg-[#8e2622] transition-colors shadow-sm",children:[(0,t.jsx)(d.Eye,{className:"w-4 h-4"})," View Invoice"]})})]},e.id))}),k.length>N&&(0,t.jsx)("div",{className:"p-4 border-t border-gray-100 flex justify-center bg-gray-50/50",children:(0,t.jsxs)("button",{onClick:()=>j(e=>e+10),className:"px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group",children:[(0,t.jsx)(f.ChevronDown,{className:"w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"}),"Show More (+",k.length-N," remaining)"]})})]}),v&&(0,t.jsx)("div",{className:"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200",children:(0,t.jsxs)("div",{className:"bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 my-8 relative animate-in zoom-in-95 duration-200",children:[(0,t.jsxs)("div",{className:"bg-gray-900 text-white p-4 px-8 flex justify-between items-center",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400",children:[(0,t.jsx)(r.FileText,{className:"w-4 h-4 text-[#aa2d29]"})," Tax Invoice Preview"]}),(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsxs)("button",{onClick:()=>{let e,t,a,s;return e=b(v.vehicleType),t=new Blob([`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #INV-${v.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    body { background-color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { background: #ffffff; width: 100%; max-width: 720px; border-radius: 24px; padding: 48px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
    .top-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .brand-logo { font-size: 20px; font-weight: 900; color: #111827; margin: 0; display: flex; items-center; gap: 8px; }
    .brand-logo span { color: #aa2d29; }
    .sub-company { font-size: 12px; font-weight: 700; color: #94a3b8; margin: 6px 0 2px 0; }
    .tax-no { font-size: 12px; color: #94a3b8; margin: 0; font-weight: 500; }
    .inv-right { text-align: right; }
    .badge { display: inline-block; padding: 5px 14px; background: #ecfdf5; color: #047857; font-weight: 800; font-size: 11px; border-radius: 9999px; border: 1px solid #a7f3d0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .inv-num { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
    .date-str { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }
    .divider { height: 1px; background: #f1f5f9; margin: 28px 0; }
    .info-box { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; background: #f8fafc; padding: 24px 28px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 28px; }
    .sec-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px; }
    .client-name { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
    .client-detail { font-size: 13px; color: #64748b; margin: 3px 0; font-weight: 500; }
    .table-container { border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #f8fafc; padding: 14px 20px; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 18px 20px; border-top: 1px solid #f1f5f9; font-weight: 700; color: #0f172a; }
    .status-confirmed { color: #059669; font-weight: 800; text-align: right; }
    .bottom-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 28px; }
    .stamp-box { background: #ecfdf5; padding: 16px 20px; border-radius: 16px; border: 1px solid #a7f3d0; font-size: 13px; color: #065f46; font-weight: 800; display: flex; items-center; gap: 12px; max-width: 360px; }
    .stamp-sub { font-size: 11px; color: #059669; font-weight: 500; margin-top: 3px; }
    .total-box { background: #0f172a; color: #ffffff; padding: 20px 32px; border-radius: 20px; text-align: right; min-width: 220px; }
    .total-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; }
    .total-price { font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin-top: 2px; display: block; }
    .page-footer { margin-top: 32px; font-size: 12px; font-weight: 600; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="top-header">
      <div>
        <img src="${window.location.origin}/logo.png" alt="Logo" style="height: 38px; width: auto; display: block; margin-bottom: 8px;" />
        <div class="sub-company">VIP Chauffeur & Logistics Services Ltd.</div>
        <div class="tax-no">Tax Registration No: 9812-4091-VIP</div>
      </div>
      <div class="inv-right">
        <span class="badge">PAID IN FULL</span>
        <h2 class="inv-num">INVOICE #INV-${v.id}</h2>
        <p class="date-str">Date: ${v.transferDate} ${v.transferTime||""}</p>
      </div>
    </div>

    <div class="divider"></div>

    <div class="info-box">
      <div>
        <span class="sec-label">BILLED TO</span>
        <p class="client-name">${v.firstName||""} ${v.lastName||""}</p>
        <p class="client-detail">${v.email||""}</p>
        <p class="client-detail">${v.phone||""}</p>
        ${v.company?`<p class="client-detail" style="color:#aa2d29; font-weight:700; margin-top:6px;">Partner: ${v.company}</p>`:""}
      </div>
      <div>
        <span class="sec-label">SERVICE DETAILS</span>
        <p class="client-detail"><span style="color:#94a3b8;">Service:</span> <b>${v.transferType||"Airport Transfer"}</b></p>
        <p class="client-detail"><span style="color:#94a3b8;">Vehicle:</span> <b>${v.vehicleType||"Executive Vehicle"}</b></p>
        <p class="client-detail"><span style="color:#94a3b8;">Passengers:</span> <b>${v.passengers||"1"} Pax</b></p>
        ${v.flightNumber?`<p class="client-detail"><span style="color:#94a3b8;">Flight No:</span> <b>${v.flightNumber}</b></p>`:""}
      </div>
    </div>

    <span class="sec-label" style="margin-left:4px;">ROUTE BREAKDOWN</span>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>TRANSFER ROUTE</th>
            <th style="text-align:center;">TYPE</th>
            <th style="text-align:right;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aa2d29" stroke-width="2" style="vertical-align:-2px; margin-right:6px; display:inline-block;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${v.pickupLocation} ➔ ${v.dropoffLocation}</td>
            <td style="text-align:center; color:#64748b; font-weight:500;">${v.vehicleType}</td>
            <td class="status-confirmed">CONFIRMED</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="divider"></div>

    <div class="bottom-row">
      <div class="stamp-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <div style="font-weight:700; color:#047857; font-size:14px;">Verified Electronic Tax Invoice</div>
          <div class="stamp-sub">Issued electronically under VIP Corporate Account Agreement.</div>
        </div>
      </div>
      <div class="total-box">
        <span class="total-label">TOTAL AMOUNT PAID</span>
        <span class="total-price">$${e}.00</span>
        <span style="font-size:24px; font-weight:900; color:#ffffff; display:block; margin-top:2px;">USD</span>
      </div>
    </div>
  </div>

  <div class="page-footer">VIP Chauffeur Services \xa9 2026</div>
</body>
</html>`.trim()],{type:"text/html;charset=utf-8"}),a=URL.createObjectURL(t),void((s=document.createElement("a")).href=a,s.download=`Invoice_INV_${v.id}.html`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(a))},className:"flex items-center gap-2 px-5 py-2 bg-[#aa2d29] hover:bg-[#8e2622] text-white rounded-lg text-xs font-bold transition-all shadow-sm",children:[(0,t.jsx)(l.Download,{className:"w-3.5 h-3.5"})," Download"]}),(0,t.jsx)("button",{onClick:()=>w(null),className:"p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors",children:(0,t.jsx)(c.X,{className:"w-5 h-5"})})]})]}),(0,t.jsxs)("div",{className:"p-8 md:p-12 space-y-8 bg-white",children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row justify-between items-start border-b border-gray-200 pb-8 gap-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(i.default,{src:h.default,alt:"Logo",className:"h-10 w-auto mb-3 mix-blend-multiply",priority:!0}),(0,t.jsx)("p",{className:"text-xs text-gray-400 font-medium",children:"VIP Chauffeur & Logistics Services Ltd."}),(0,t.jsx)("p",{className:"text-xs text-gray-400 font-medium",children:"Tax Registration No: 9812-4091-VIP"})]}),(0,t.jsxs)("div",{className:"text-left md:text-right",children:[(0,t.jsx)("span",{className:"px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 uppercase tracking-widest inline-block mb-2",children:"PAID IN FULL"}),(0,t.jsxs)("h2",{className:"text-2xl font-black font-heading text-gray-900",children:["INVOICE #INV-",v.id]}),(0,t.jsxs)("p",{className:"text-xs text-gray-500 font-medium mt-1",children:["Date: ",v.transferDate," ",v.transferTime||""]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/80 p-6 rounded-2xl border border-gray-100",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{className:"text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2",children:"Billed To"}),(0,t.jsxs)("p",{className:"font-bold text-gray-900 text-base",children:[v.firstName," ",v.lastName]}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:v.email||"No email provided"}),(0,t.jsx)("p",{className:"text-xs text-gray-500",children:v.phone||"No phone provided"}),v.company&&(0,t.jsxs)("p",{className:"text-xs font-semibold text-[#aa2d29] mt-2 flex items-center gap-1.5",children:[(0,t.jsx)(m.Building2,{className:"w-3.5 h-3.5"})," Partner: ",v.company]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{className:"text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2",children:"Service Details"}),(0,t.jsxs)("p",{className:"text-xs font-semibold text-gray-700 mb-1",children:[(0,t.jsx)("span",{className:"text-gray-400 font-normal",children:"Service:"})," ",v.transferType||"VIP Transfer"]}),(0,t.jsxs)("p",{className:"text-xs font-semibold text-gray-700 mb-1",children:[(0,t.jsx)("span",{className:"text-gray-400 font-normal",children:"Vehicle:"})," ",v.vehicleType]}),(0,t.jsxs)("p",{className:"text-xs font-semibold text-gray-700 mb-1",children:[(0,t.jsx)("span",{className:"text-gray-400 font-normal",children:"Passengers:"})," ",v.passengers||"1"," Pax"]}),v.flightNumber&&(0,t.jsxs)("p",{className:"text-xs font-semibold text-gray-700",children:[(0,t.jsx)("span",{className:"text-gray-400 font-normal",children:"Flight No:"})," ",v.flightNumber]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{className:"text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3",children:"Route Breakdown"}),(0,t.jsx)("div",{className:"border border-gray-200 rounded-2xl overflow-hidden",children:(0,t.jsxs)("table",{className:"w-full text-left text-xs",children:[(0,t.jsx)("thead",{className:"bg-gray-100 text-gray-600 uppercase font-bold text-[10px] tracking-wider",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"p-4",children:"Transfer Route"}),(0,t.jsx)("th",{className:"p-4 text-center",children:"Type"}),(0,t.jsx)("th",{className:"p-4 text-right",children:"Status"})]})}),(0,t.jsx)("tbody",{className:"divide-y divide-gray-100",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{className:"p-4 font-semibold text-gray-900",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(p.MapPin,{className:"w-3.5 h-3.5 text-[#aa2d29]"}),v.pickupLocation," ➔ ",v.dropoffLocation]})}),(0,t.jsx)("td",{className:"p-4 text-center font-medium text-gray-600",children:v.vehicleType}),(0,t.jsx)("td",{className:"p-4 text-right font-bold text-emerald-600",children:"CONFIRMED"})]})})]})})]}),(0,t.jsxs)("div",{className:"flex flex-col md:flex-row justify-between items-end pt-4 border-t border-gray-200 gap-6",children:[(0,t.jsxs)("div",{className:"flex items-start gap-3 bg-[#ecfdf5] p-4 px-5 rounded-2xl border border-[#a7f3d0] max-w-md",children:[(0,t.jsx)(x,{className:"w-5 h-5 text-[#047857] shrink-0 mt-0.5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-bold text-[#047857] text-sm",children:"Verified Electronic Tax Invoice"}),(0,t.jsx)("p",{className:"text-[11px] text-[#059669] mt-0.5 leading-snug",children:"Issued electronically under VIP Corporate Account Agreement."})]})]}),(0,t.jsxs)("div",{className:"text-right bg-[#0f172a] text-white p-6 px-8 rounded-3xl shadow-sm min-w-[220px]",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] block mb-1",children:"TOTAL AMOUNT PAID"}),(0,t.jsxs)("span",{className:"text-4xl font-black font-heading text-white block leading-none",children:["$",b(v.vehicleType),".00"]}),(0,t.jsx)("span",{className:"text-2xl font-black font-heading text-white block mt-1 tracking-tight",children:"USD"})]})]})]}),(0,t.jsx)("div",{className:"bg-gray-50 p-4 px-8 border-t border-gray-100 flex justify-center items-center text-xs text-gray-400",children:(0,t.jsx)("span",{children:"VIP Chauffeur Services © 2026"})})]})})]})}],84028)}]);