// Copyright (c) 2019, Kelompok Booking Mobil and contributors
// For license information, please see license.txt

frappe.ui.form.on('Delivery Order', {
	refresh: function(frm) {

	},
	// handle delivery order line table
	id_customer: function(frm){
		if(frm.doc.id_customer){
			frappe.call({
				method: "frappe.client.get",
				args:{
					doctype: "Sales Order Mobil",
					name: frm.doc.id_customer
				},
				callback: function(r){
					if(r.message.sales_mobil_line[0]){
						frappe.model.add_child(cur_frm.doc, "Delivery Order Line", "delivery_order_line");
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
	},
	// check if the delivery date is before today's date or after tanggal sewa
	tanggal_deliver:function(frm){
		frappe.call({
			method: "frappe.client.get",
			args:{
				doctype: "Sales Order Mobil",
				name: frm.doc.id_customer
			},
			callback: function(r){
				var tanggalSewa = r.message.tanggal_sewa;
				if(frm.doc.tanggal_deliver > tanggalSewa){
					frm.set_value('tanggal_deliver', '');
					frappe.throw(__('Tanggal deliver tidak bisa setelah tanggal sewa'));
				}else if(frm.doc.tanggal_deliver < get_today()){
					frm.set_value('tanggal_deliver', '');
					frappe.throw(__('Tidak dapat memilih tanggal terlebih dahulu'));
				}
			}
		})
	}
});

// Filter only submitted data
cur_frm.set_query('id_customer', function(){
	return{
		filters:[
			['Sales Order Mobil', 'docstatus', '=', '1']
		]
	}
})