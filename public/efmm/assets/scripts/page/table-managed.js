var TableManaged = function() {

  var initTable = function() {
    var table = $('#sample_2');

    table.dataTable({

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
            "lengthMenu": "Show  _MENU_",
            "paging": {
                "previous": "Prev",
                "next": "Next"
            },
            "search": "",
            "zeroRecords": "No matching records found"
        },

        // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
        // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
        // So when dropdowns used the scrollable div should be removed.
        //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

        "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

        "lengthMenu": [
            [5, 10, 20, -1],
            [5, 10, 20, "All"] // change per page values here
        ],
        // set the initial value
        "pageLength":10,
        "columnDefs": [{  // set default column settings
            'orderable': false,
            'targets': [0]
        }, {
            "searchable": false,
            "targets": [0]
        }],
        "order": [
            [1, "asc"]
        ] // set first column as a default sort by asc
        // ,"searching": false
    });

    var tableWrapper = jQuery('#sample_2_wrapper');

    table.find('.group-checkable').change(function () {
        var set = jQuery(this).attr("data-set");
        var checked = jQuery(this).is(":checked");
        jQuery(set).each(function () {
            if (checked) {
                $(this).attr("checked", true);
            } else {
                $(this).attr("checked", false);
            }
        });
        jQuery.uniform.update(set);
    });

    tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
  }

  var initTable5 = function () {
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
          "columnDefs": [{  // set default column settings
              'orderable': false,
              'targets': [0]
          }, {
              "searchable": false,
              "targets": [0]
          }],
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
      initTable5();
      $('.dataTables_filter input').css('{ width: 70px; }');
      $('.dataTables_filter input').attr('placeholder','Search Cluster#');
    }
  };
}();