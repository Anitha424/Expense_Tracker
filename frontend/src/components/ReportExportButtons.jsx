import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../services/reportService';

const ReportExportButtons = ({ transactions = [], categories = [], reportData = null, month = null }) => {
  // Support both new and old props
  const dataToExport = transactions.length > 0 ? transactions : reportData?.transactions || [];
  const monthLabel = month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleExportExcel = () => {
    try {
      exportToExcel(dataToExport, categories);
    } catch (error) {
      alert('Error exporting to Excel. Please try again.');
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(dataToExport, categories);
    } catch (error) {
      alert('Error exporting to PDF. Please try again.');
      console.error(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 p-6 backdrop-blur-md border border-slate-700/50 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-400" />
        Export Reports
      </h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {/* Excel Export */}
        <motion.button
          onClick={handleExportExcel}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-green-600 to-green-700 p-4 transition-all hover:shadow-lg hover:shadow-green-500/20"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
          <div className="relative flex flex-col items-center justify-center gap-2">
            <Download className="w-6 h-6 text-white" />
            <span className="text-sm font-semibold text-white">Excel</span>
            <span className="text-xs text-green-100">Spreadsheet</span>
          </div>
        </motion.button>

        {/* PDF Export */}
        <motion.button
          onClick={handleExportPDF}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-red-600 to-red-700 p-4 transition-all hover:shadow-lg hover:shadow-red-500/20"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
          <div className="relative flex flex-col items-center justify-center gap-2">
            <Download className="w-6 h-6 text-white" />
            <span className="text-sm font-semibold text-white">PDF</span>
            <span className="text-xs text-red-100">Document</span>
          </div>
        </motion.button>

        {/* Info Card */}
        <motion.div
          className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4 flex flex-col justify-center"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-300 text-center">
            <span className="block font-semibold text-slate-200 mb-1">
              {dataToExport.length}
            </span>
            Transactions
          </p>
        </motion.div>
      </div>

      {/* Export Info */}
      <motion.div
        className="mt-4 p-3 rounded-lg bg-blue-900/30 border border-blue-700/50"
        variants={itemVariants}
      >
        <p className="text-xs text-blue-200">
          📊 <span className="font-semibold">Reports include:</span> Transaction history, category
          totals, and monthly summary
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReportExportButtons;
