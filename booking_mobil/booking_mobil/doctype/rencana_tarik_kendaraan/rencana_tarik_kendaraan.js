// Copyright (c) 2019, Kelompok Booking Mobil and contributors
// For license information, please see license.txt

frappe.ui.form.on('Rencana Tarik Kendaraan', {
	refresh: function(frm) {

	},
	id_customer: function(frm){
		if(frm.doc.id_customer){
			frappe.call({
				method: "frappe.client.get",
				args:{
					doctype: "Get Passed",
					name: frm.doc.id_customer
				},
				callback: function(r){
					if(r.message.mobil_line[0]){
						frappe.model.add_child(cur_frm.doc, "Mobil Line", "mobil_line");
						$.each(frm.doc.mobil_line || [], function(i, v){
						var data_mobil = r.message.mobil_line[0];
							frappe.model.set_value(v.doctype, v.name, "kode_mobil",
							data_mobil.kode_mobil);
							frappe.model.set_value(v.doctype, v.name, "nama_mobil", data_mobil.nama_mobil);
							frappe.model.set_value(v.doctype, v.name, "no_polisi", data_mobil.no_polisi);
							frappe.model.set_value(v.doctype, v.name, "harga_mobil", data_mobil.harga_mobil);
							})
					}
					
					frm.refresh_field("mobil_line");
				}
			})
		}
	},
	tanggal_tarik:function(frm){
		if(frm.doc.estimasi_tanggal < frm.doc.tanggal_tarik){
			frm.set_value('tanggal_tarik', '');
			frappe.throw(__('Tanggal tarik kendaraan melewati estimasi tanggal kembali'));
		}
	}
});

cur_frm.set_query('id_driver', function(doc, cdt, cdn){
	return{
		filters:[
			['Delivery Order', 'status_delivery', '=', 'Delivered']
		]
	}
})