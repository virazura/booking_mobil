// Copyright (c) 2019, Kelompok Booking Mobil and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sales Order Mobil', {
	
	refresh: function(frm) {
		
	},
	tanggal_sewa : function(frm){
		//check if tanggal sewa is olden
		if(frm.doc.tanggal_sewa < get_today()){
			frm.set_value('tanggal_sewa', '');
			frappe.throw(__('Tidak dapat memilih tanggal terlebih dahulu'));
		}
	},
	
	estimasi_tanggal:function(frm, cdt, cdn){
		// check if tanggal sewa and estimasi tanggal equal
		if(frm.doc.tanggal_sewa === frm.doc.estimasi_tanggal){
			frm.set_value('estimasi_tanggal', '');
			frappe.throw(__('Tidak dapat memilih tanggal yang sama'));
		}

		// get the difference of tanggal sewa and estimasi tanggal kembali
		var child = locals[cdt][cdn];
		var doc = frm.doc;
		var diff_day = frappe.datetime.get_diff(child.estimasi_tanggal, doc.tanggal_sewa);
		frm.set_value('total_hari', diff_day);
	},
	id_mobil:function(frm, cdt, cdn){
		//assign the child table after select id_mobil
		if(frm.doc.id_mobil){
			frappe.call({
				method: "frappe.client.get",
				args:{
					doctype: "Master Mobil",
					name: frm.doc.id_mobil
				},
				callback: function(r){
					frappe.model.add_child(cur_frm.doc, "Sales Mobil Line", "sales_mobil_line");
					$.each(frm.doc.sales_mobil_line || [], function(i, v){
						frappe.model.set_value(v.doctype, v.name, "kode_mobil", r.message.name);
                        frappe.model.set_value(v.doctype, v.name, "nama_mobil", r.message.nama_mobil);
                        frappe.model.set_value(v.doctype, v.name, "no_polisi", r.message.no_polisi);
						frappe.model.set_value(v.doctype, v.name, "harga_mobil", r.message.harga_mobil);
					})
					frm.refresh_fields("sales_mobil_line");
				}
			})
		}

		//count biaya 
		if(frm.doc.id_mobil){
			frappe.call({
				method: 'frappe.client.get',
				args:{
					doctype: "Master Mobil",
					name: frm.doc.id_mobil
				},
				callback: function(r){
					var hargaMobil = r.message.harga_mobil;
					var totalHari = frm.doc.total_hari;
					var biaya = 0;
					if(frm.doc.id_driver){
						biaya = (hargaMobil * totalHari) + 50000;
					}else{
						biaya = (hargaMobil * totalHari);
					}
					frm.set_value("biaya", biaya);
				}
			})
		}	
	}
});

// // filter mobil available
cur_frm.set_query('id_mobil', function(doc, cdt, cdn){
	var d = locals[cdt][cdn];
	return{
		filters:[
			['Master Mobil', 'status', '=', 'Available']
		]
	}
})

// filter driver available
cur_frm.set_query('id_driver', function(doc, cdt, cdn){
	return{
		filters:[
			['Master Driver', 'status_driver', '=', 'Available']
		]
	}
})