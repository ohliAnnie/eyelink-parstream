var TableManaged = function() {

  var initTable = function() {
    var table = $('#dtPattern');
    table.DataTable({
      // Internationalisation. For more info refer to http://datatables.net/manual/i18n
      "language": {
        "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        },
        "emptyTable": "No data available in table",
        "info": "Showing _START_ to _END_ of _TOTAL_ records",
        "infoEmpty": "No records found",
        "infoFiltered": "(filtered1 from _MAX_ total records)",
        "lengthMenu": "Show _MENU_ records",
        "paging": {
          "previous": "Prev",
          "next": "Next"
        },
        "search": "Search:",
        "zeroRecords": "No matching records found"
      },
      "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
      "bLengthChange": false,
      "pageLength": 8,
      // "bInfo": false,
      "bFilter": false,
      //"bPaginate": false,
      "bSort": true,
      "order": [
        [1, "asc"]
      ] // set first column as a default sort by asc
    });
  };

  return {

    //main function to initiate the module
    init: function() {
      if (!jQuery().dataTable) {
        return;
      }
      initTable();
    }
  };
}();