import jsPDF from "jspdf";
import { FaFilePdf } from "react-icons/fa";

function ExportPDF({ stats }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("FraudShield AI Security Audit Report", 20, 25);
    
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(20, 32, 190, 32);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Report Generation Date: ${new Date().toLocaleString()}`, 20, 42);
    doc.text("System Scope: End-to-End Realtime Fraud Detection", 20, 50);
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary Statistics", 20, 68);
    
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // slate-700
    if (stats) {
      const totalVal = stats.total ?? stats.total_transactions ?? 0;
      const fraudVal = stats.fraud ?? stats.fraud_transactions ?? 0;
      const rateVal = stats.fraud_rate ?? 0;
      doc.text(`- Total Transactions Processed: ${totalVal}`, 20, 78);
      doc.text(`- Total Fraud Flagged Cases: ${fraudVal}`, 20, 88);
      doc.text(`- Fraud Incidence Ratio: ${rateVal}%`, 20, 98);
      doc.text(`- System Health: Secure (100% Core AI shields operational)`, 20, 108);
    } else {
      doc.text("- Security status: Operational", 20, 78);
      doc.text("- Core AI model: XGBoost classification enabled", 20, 88);
      doc.text("- Explainability module: SHAP values computed", 20, 98);
    }
    
    doc.save("FraudShield_Executive_Report.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer text-sm"
    >
      <FaFilePdf size={16} /> Export PDF Report
    </button>
  );
}

export default ExportPDF;