// Dados iniciais fictícios
let leads = [
  { name: "João Silva", email: "joao@example.com", status: "Novo", month: "Janeiro" },
  { name: "Maria Souza", email: "maria@example.com", status: "Contato", month: "Fevereiro" },
  { name: "Carlos Lima", email: "carlos@example.com", status: "Convertido", month: "Março" },
  { name: "Ana Paula", email: "ana@example.com", status: "Desistiu", month: "Abril" },
  { name: "Rafael Torres", email: "rafael@example.com", status: "Sem Retorno", month: "Maio" }
];

// Elementos DOM
const leadForm = document.getElementById("leadForm");
const leadsTable = document.getElementById("leadsTable").querySelector("tbody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const resetBtn = document.getElementById("resetBtn");

let statusChart, monthlyChart;

// Atualizar métricas
function updateMetrics() {
  document.getElementById("totalLeads").innerText = leads.length;
  document.getElementById("convertedLeads").innerText = leads.filter(l => l.status==="Convertido").length;
  document.getElementById("contactLeads").innerText = leads.filter(l => l.status==="Contato").length;
  document.getElementById("newLeads").innerText = leads.filter(l => l.status==="Novo").length;
  document.getElementById("desistiuLeads").innerText = leads.filter(l => l.status==="Desistiu").length;
  document.getElementById("semRetornoLeads").innerText = leads.filter(l => l.status==="Sem Retorno").length;
}

// Render tabela
function renderLeads() {
  leadsTable.innerHTML = "";
  const search = searchInput.value.toLowerCase();
  const filter = statusFilter.value;

  leads.filter(l =>
    (l.name.toLowerCase().includes(search) || l.email.toLowerCase().includes(search)) &&
    (filter==="Todos" || l.status===filter)
  ).forEach((lead,index)=>{
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${lead.name}</td>
      <td>${lead.email}</td>
      <td><span class="badge ${lead.status.replace(" ","")}">${lead.status}</span></td>
      <td><button class="send-btn" onclick="sendMessage(${index})">📩 Simular WhatsApp</button></td>
    `;
    leadsTable.appendChild(row);
  });

  renderCharts();
  updateMetrics();
}

// Adicionar lead
leadForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const status = document.getElementById("status").value;
  const month = "Janeiro"; // dados fictícios
  leads.push({name,email,status,month});
  leadForm.reset();
  renderLeads();
});

// Reset demo
resetBtn.addEventListener("click", ()=>{
  leads = [];
  renderLeads();
});

// Simular envio
function sendMessage(index){
  const lead = leads[index];
  alert(`Mensagem simulada enviada para ${lead.name} (${lead.email}) via WhatsApp!`);
}

// Filtros
searchInput.addEventListener("input", renderLeads);
statusFilter.addEventListener("change", renderLeads);

// Gráficos
function renderCharts(){
  const statusCounts = { Novo:0, "Contato":0, Convertido:0, Desistiu:0, "Sem Retorno":0 };
  leads.forEach(l=>statusCounts[l.status]++);

  // Status Chart
  const ctx = document.getElementById("statusChart").getContext("2d");
  if(statusChart) statusChart.destroy();
  statusChart = new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:["Novo","Contato","Convertido","Desistiu","Sem Retorno"],
      datasets:[{
        data:[
          statusCounts.Novo,
          statusCounts["Contato"],
          statusCounts.Convertido,
          statusCounts.Desistiu,
          statusCounts["Sem Retorno"]
        ],
        backgroundColor:["#44bd32","#fbc531","#0097e6","#e84118","#718093"]
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{position:"bottom"}}
    }
  });

  // Monthly Chart
  const months=["Janeiro","Fevereiro","Março","Abril","Maio","Junho"];
  const monthlyCounts = months.map(m=>leads.filter(l=>l.month===m).length);
  const ctx2 = document.getElementById("monthlyChart").getContext("2d");
  if(monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(ctx2,{
    type:"bar",
    data:{
      labels:months,
      datasets:[{label:"Leads por mês",data:monthlyCounts,backgroundColor:"#44bd32"}]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false}}
    }
  });
}

// Inicial
renderLeads();
