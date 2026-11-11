document.addEventListener('DOMContentLoaded', () => {
  const btnSidebar = document.getElementById('btn-sidebar');
  const sidebar = document.querySelector('.sidebar');

  if (btnSidebar && sidebar) {
    btnSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
});