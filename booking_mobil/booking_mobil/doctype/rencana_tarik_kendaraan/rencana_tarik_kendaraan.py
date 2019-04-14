# -*- coding: utf-8 -*-
# Copyright (c) 2019, Kelompok Booking Mobil and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RencanaTarikKendaraan(Document):
	pass

	def validate(self):
		self.change_status()

	def change_status(self):
		if(self.id_driver ):
			driver = frappe.get_doc('Master Driver', self.id_driver)
			driver.status_driver = "Available"
			driver.save()

		if(self.mobil_line):
			for row in self.mobil_line:
				mobil = frappe.get_doc('Master Mobil', row.kode_mobil)
				mobil.status = 'Available'
				mobil.save()

			

