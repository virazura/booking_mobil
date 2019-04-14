# -*- coding: utf-8 -*-
# Copyright (c) 2019, Kelompok Booking Mobil and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class SalesOrderMobil(Document):
	pass

	def on_update(self):
		self.on_approve()

	def on_approve(self):
		if(self.docstatus == 1):
			kontrak = frappe.new_doc("Kontrak Payung")
			kontrak.nama_customer = self.nama_customer
			kontrak.tanggal_sewa = self.tanggal_sewa
			kontrak.estimasi_tanggal = self.estimasi_tanggal
			for row in self.sales_mobil_line:
				kontrak.nama_mobil = row.nama_mobil
				kontrak.no_polisi = row.no_polisi
			kontrak.fixed_harga = self.biaya
			kontrak.nama_driver = self.nama_driver
			kontrak.save()
			kontrak.submit()
			self.change_status()

		# send data to sales invoice mobil
			invoice = frappe.new_doc("Sales Invoice Mobil")
			invoice.nama_customer = self.nama_customer
			invoice.no_ktp = self.no_ktp
			invoice.alamat_customer = self.alamat_customer
			invoice.tanggal_sewa = self.tanggal_sewa
			invoice.estimasi_tanggal = self.estimasi_tanggal
			invoice.nama_driver = self.nama_driver
			invoice.fixed_harga = self.biaya
			for row in self.sales_mobil_line:
				invoice.append('sales_invoice_line',{
					'kode_mobil': row.kode_mobil,
					'nama_mobil': row.nama_mobil,
					'no_polisi': row.no_polisi,
					'harga_mobil': row.harga_mobil
				})
			invoice.save()
			invoice.submit()
			self.change_status()


	def change_status(self):
		if(self.id_driver ):
			driver = frappe.get_doc('Master Driver', self.id_driver)
			driver.status_driver = 'Booked'
			driver.save()
			
		
		if(self.sales_mobil_line):
			for row in self.sales_mobil_line:
				mobil = frappe.get_doc('Master Mobil', row.kode_mobil)
				mobil.status = 'Rented'
				mobil.save()
