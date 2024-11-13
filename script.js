const apiUrl = "https://api.9capi.com/arenaLeaderboardHeimdall"; // Substitua pelo URL da sua API

let currentData = [];
let displayLimit = 10;
let autoRefreshInterval;
let refreshTime = 1; // Em minutos

$(document).ready(function () {
  $("#loadDataButton").on("click", function () {
    fetchData();
  });

  $("#loadMoreButton").on("click", function () {
    displayLimit += 50;
    renderTable(currentData);
  });

  $("#updateInterval").on("change", function () {
    refreshTime = parseInt($(this).val());
    startAutoRefresh();
  });

  // Carregar dados iniciais e iniciar recarregamento automático
  fetchData();
  startAutoRefresh();
});

function fetchData() {
  $.getJSON(apiUrl, function (data) {
    currentData = data;
    renderTable(currentData);
  }).fail(function () {
    alert("Erro ao carregar dados. Verifique a API.");
  });
}

function renderTable(data) {
  const tableBody = $("#arenaTable tbody");
  tableBody.empty();

  // Mostrar apenas os primeiros 'displayLimit' itens
  const limitedData = data.slice(0, displayLimit);

  limitedData.forEach((item) => {
    // Formatar o endereço para exibir apenas os 3 primeiros e 4 últimos caracteres
    const shortAddress = `${item.avataraddress.slice(0, 3)}...${item.avataraddress.slice(-4)}`;

    const row = `
      <tr>
        <td data-label="Rank">${item.rankid}</td>
        <td data-label="Pontuação">${item.score}</td>
        <td data-label="Guilda">${item.guild || "N/A"}</td>
        <td data-label="Nome">${item.avatarname.trim()}</td>
        <td data-label="Endereço">
          <a href="heimdall.9cscan.com/address/${item.avataraddress}" target="_blank" title="${item.avataraddress}">
            ${shortAddress}
          </a>
        </td>
        <td data-label="CP">${item.cp}</td>
        <td data-label="Rodada">${item.roundid}</td>
        <td data-label="Tickets">${item.currenttickets}</td>
      </tr>
    `;
    tableBody.append(row);
  });

  // Mostrar ou ocultar o botão "Carregar Mais" dependendo da quantidade de dados
  if (displayLimit >= data.length) {
    $("#loadMoreButton").hide();
  } else {
    $("#loadMoreButton").show();
  }
}


// Mostrar ou ocultar o botão "Carregar Mais" dependendo da quantidade de dados
if (displayLimit >= data.length) {
  $("#loadMoreButton").hide();
} else {
  $("#loadMoreButton").show();
}

function startAutoRefresh() {
  // Limpar o intervalo anterior, se houver
  clearInterval(autoRefreshInterval);

  // Configurar o novo intervalo
  autoRefreshInterval = setInterval(fetchData, refreshTime * 60000);
}
