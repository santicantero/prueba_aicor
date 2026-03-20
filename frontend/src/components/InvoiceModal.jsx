import { useRef } from 'react'
import html2pdf from 'html2pdf.js'
import { useAuth } from '../context/AuthContext'

export default function InvoiceModal({ isOpen, onClose, order }) {
    const { user } = useAuth()
    const invoiceRef = useRef(null)

    if (!isOpen || !order) return null

    const handleDownload = () => {
        const element = invoiceRef.current
        const opt = {
            margin:       [0.5, 0.5, 0.5, 0.5],
            filename:     `Factura-Aicor-${order.id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        }
        
        html2pdf().set(opt).from(element).save()
    }

    const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    const customerName = order.full_name || order.nombre || user?.name || 'Cliente de Aicor'
    const customerEmail = order.email || user?.email || 'email@cliente.com'
    const customerAddress = order.direccion || order.address || 'Dirección de envío no especificada'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header Actions - Not included in PDF */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                        Vista de Factura
                    </h2>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleDownload}
                            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined">download</span>
                            Descargar en PDF
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* PDF Content Area */}
                <div className="overflow-y-auto w-full bg-slate-100 flex-1">
                    <div className="max-w-[800px] mx-auto my-8 bg-white shadow-md">
                        {/* El contenedor que se exporta a PDF */}
                        <div ref={invoiceRef} className="p-10 bg-white text-slate-900">
                            
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h1 className="text-4xl font-black text-primary tracking-tighter mb-2">AICOR STORE</h1>
                                    <p className="text-slate-500 text-sm">Tu tecnología, al mejor precio.</p>
                                    <p className="text-slate-500 text-sm mt-4">NIF: B12345678</p>
                                    <p className="text-slate-500 text-sm">Calle de la Informática 12, Local 4</p>
                                    <p className="text-slate-500 text-sm">29000 Málaga, España</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-3xl font-light text-slate-300 mb-2 uppercase tracking-widest">Factura</h2>
                                    <p className="text-sm font-bold text-slate-700">Factura Nº: <span className="font-normal text-slate-500">FAC-{new Date().getFullYear()}-{order.id.toString().padStart(4, '0')}</span></p>
                                    <p className="text-sm font-bold text-slate-700">Nº Pedido: <span className="font-normal text-slate-500">#{order.id}</span></p>
                                    <p className="text-sm font-bold text-slate-700">Fecha: <span className="font-normal text-slate-500">{orderDate}</span></p>
                                </div>
                            </div>

                            <hr className="border-slate-200 mb-8" />

                            {/* Customer Info */}
                            <div className="mb-12">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Facturar a:</h3>
                                <p className="text-lg font-bold text-slate-800">{customerName}</p>
                                <p className="text-slate-600 mt-1">{customerEmail}</p>
                                <p className="text-slate-600 mt-1">{customerAddress}</p>
                            </div>

                            {/* Order Items Table */}
                            <table className="w-full mb-12 text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-800">
                                        <th className="py-3 font-bold text-slate-800 uppercase text-xs tracking-wider">Concepto</th>
                                        <th className="py-3 font-bold text-slate-800 uppercase text-xs tracking-wider text-center">Cant.</th>
                                        <th className="py-3 font-bold text-slate-800 uppercase text-xs tracking-wider text-right">Precio/Ud</th>
                                        <th className="py-3 font-bold text-slate-800 uppercase text-xs tracking-wider text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.order_items.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-100">
                                            <td className="py-4 text-slate-700 font-medium">
                                                {item.product ? item.product.nombre : 'Producto desconocido'}
                                            </td>
                                            <td className="py-4 text-slate-600 text-center">{item.cantidad}</td>
                                            <td className="py-4 text-slate-600 text-right">{(parseFloat(item.precio)).toFixed(2)} €</td>
                                            <td className="py-4 text-slate-800 text-right font-bold">{(parseFloat(item.precio) * item.cantidad).toFixed(2)} €</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="w-1/2 ml-auto">
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="font-bold text-slate-500">Subtotal</span>
                                    <span className="text-slate-700">{(parseFloat(order.total) / 1.21).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="font-bold text-slate-500">IVA (21%)</span>
                                    <span className="text-slate-700">{(parseFloat(order.total) - (parseFloat(order.total) / 1.21)).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between py-4 mt-2 bg-slate-50 px-4 rounded-xl">
                                    <span className="font-black text-slate-900 text-xl">Total Factura</span>
                                    <span className="font-black text-primary text-xl">{parseFloat(order.total).toFixed(2)} €</span>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="mt-20 text-center text-slate-400 text-xs">
                                <p>El importe total de esta factura ha sido abonado.</p>
                                <p className="mt-1">Gracias por confiar en Aicor Store.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
