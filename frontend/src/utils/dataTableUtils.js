import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
// Initialize DataTable
export function initializeDataTable(tableId) {
  $(`#${tableId}`).DataTable({
    responsive: true,
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    language: {
      search: "Search:",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      paginate: {
        first: "First",
        last: "Last",
        next: "Next",
        previous: "Previous",
      },
    },
  });
}

// Destroy DataTable (if needed)
export function destroyDataTable(tableId) {
  const table = $(`#${tableId}`).DataTable();
  table.destroy();
}