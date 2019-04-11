// Copyright (c) 2019, Kelompok Booking Mobil and contributors
// For license information, please see license.txt

frappe.ui.form.on('Delivery Order', {
	refresh: function(frm) {

	},
	// handle delivery order line table
	nama_customer: function(frm){
		if(frm.doc.nama_customer){
			frappe.call({
				method: "frappe.client.get",
				args:{
					doctype: "Sales Order Mobil",
					name: frm.doc.nama_customer
				},
				callback: function(r){
					if(r.message.sales_mobil_line[0]){
						frappe.model.add_child(cur_frm.doc, "Deliver Order Line", "delivery_order_line");
					$.each(frm.doc.delivery_order_line || [], function(i, v){
						var data_sales = r.message.sales_mobil_line[0];
							frappe.model.set_value(v.doctype, v.name, "kode_mobil",
							data_sales.kode_mobil);
							frappe.model.set_value(v.doctype, v.name, "nama_mobil", data_sales.nama_mobil);
							frappe.model.set_value(v.doctype, v.name, "no_polisi", data_sales.no_polisi);
							frappe.model.set_value(v.doctype, v.name, "harga_mobil", data_sales.harga_mobil);
							})
					}
					
					frm.refresh_field("delivery_order_line");
				}
			})
		}
	}
});

// Filter only submitted data
cur_frm.set_query('nama_customer', function(){
	return{
		filters:[
			['Sales Order Mobil', 'docstatus', '=', '1']
		]
	}
})