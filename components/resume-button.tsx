"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { motion } from "framer-motion"

export function ResumeButton() {
  return (
    <motion.div 
      className="fixed bottom-8 right-8"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow">
        <a href="/KhizarJamshaidIqbal_Resume.pdf" target="_blank" rel="noopener noreferrer">
          <FileText className="mr-2 h-4 w-4" /> View Resume
        </a>
      </Button>
    </motion.div>
  )
}
