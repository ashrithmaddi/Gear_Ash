// CDN-based DataTable initialization to avoid build issues
let $ = null;
let DataTable = null;

// Load jQuery and DataTables from CDN
async function loadDependencies() {
  if ($ && DataTable) return;

  try {
    // Load jQuery
    if (!window.jQuery) {
      await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
      $ = window.jQuery;
    } else {
      $ = window.jQuery;
    }

    // Load DataTables
    if (!window.DataTable) {
      await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');
      await loadCSS('https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css');
      DataTable = window.DataTable;
    } else {
      DataTable = window.DataTable;
    }
  } catch (error) {
    console.error('Error loading dependencies:', error);
  }
}

// Helper function to load scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Helper function to load CSS
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Initialize DataTable
export async function initializeDataTable(tableId) {
  try {
    await loadDependencies();
    
    if ($ && DataTable) {
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
  } catch (error) {
    console.error('Error initializing DataTable:', error);
  }
}

// Destroy DataTable (if needed)
export async function destroyDataTable(tableId) {
  try {
    if ($ && DataTable) {
      const table = $(`#${tableId}`).DataTable();
      table.destroy();
    }
  } catch (error) {
    console.error('Error destroying DataTable:', error);
  }
}