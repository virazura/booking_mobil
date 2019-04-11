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
			order = frappe.new_doc("Kontrak Payung")
			order.nama_customer = self.nama_customer
			order.tanggal_sewa = self.tanggal_sewa
			order.estimasi_tanggal = self.estimasi_tanggal
			for row in self.sales_mobil_line:
				order.nama_mobil = row.nama_mobil
				order.no_polisi = row.no_polisi
			order.fixed_harga = self.biaya
			order.nama_driver = self.nama_driver
			order.save()
			order.submit()
			self.change_status()


	def change_status(self):
		if(self.id_driver ):
			driver = frappe.get_doc('Master Driver', self.id_driver)
			driver.status = 'Booked'
			driver.save()
			
		
		if(self.sales_mobil_line):
			for row in self.sales_mobil_line:
				mobil = frappe.get_doc('Master Mobil', row.kode_mobil)
				mobil.status = 'Rented'
				mobil.save()
