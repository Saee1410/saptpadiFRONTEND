import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const BudgetPlanner = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        totalBudget: '',
        guestCount: '',
        locationType: 'Local'
    });
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get('https://saptpadi-backend.onrender.com/api/budget/get-history');
            if (response.data.success) {
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error("History Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        if (!window.confirm(t('confirm_delete') || "हा प्लॅन डिलीट करायचा का?")) return;

        try {
            const response = await axios.delete(`https://saptpadi-backend.onrender.com/api/budget/delete-history/${id}`);
            if (response.data.success) {
                fetchHistory(); 
                if (plan && plan._id === id) setPlan(null);
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Error deleting!");
        }
    };

    const handleDownload = () => {
        window.print();
    };

     const handlePlanBudget = async () => {
    if (!formData.totalBudget || !formData.guestCount) {
        return alert(t('fill_all_fields') || "कृपया सर्व माहिती भरा!");
    }

    setLoading(true);
    setPlan(null); // जुना प्लॅन रिसेट करा

    try {
        const payload = {
            totalBudget: Number(formData.totalBudget),
            guestCount: Number(formData.guestCount),
            locationType: formData.locationType
        };

        const response = await axios.post('https://saptpadi-backend.onrender.com/api/budget/plan-budget', payload);
        
        if (response.data.success) {
            setPlan(response.data.plan);
            fetchHistory(); // नवीन प्लॅन आल्यावर हिस्ट्री रिफ्रेश करा
        }
    } catch (error) {
        console.error("Error:", error);
        const errorMsg = error.response?.data?.message || "सर््हरमध्ये काहीतरी तांत्रिक बिघाड आहे.";
        alert(errorMsg);
    } finally {
        setLoading(false); // लोडिंग बंद करा
    }
};


    return (
        <div className="min-h-screen bg-stone-50 py-10 px-4 font-serif">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-area { border: none !important; box-shadow: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    body { background: white !important; }
                }
            `}} />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end gap-2 mb-4 no-print">
                    <button onClick={() => changeLanguage('mr')} className={`px-4 py-1 rounded-full text-xs font-bold border-2 transition-all ${i18n.language === 'mr' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'}`}>मराठी</button>
                    <button onClick={() => changeLanguage('hi')} className={`px-4 py-1 rounded-full text-xs font-bold border-2 transition-all ${i18n.language === 'hi' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'}`}>हिन्दी</button>
                    <button onClick={() => changeLanguage('en')} className={`px-4 py-1 rounded-full text-xs font-bold border-2 transition-all ${i18n.language === 'en' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'}`}>English</button>
                </div>

                <div className="text-center mb-10 no-print">
                    <h2 className="text-4xl font-bold text-stone-800 tracking-tight">
                        {t('welcome_title_1', 'AI Wedding')} <span className="text-amber-600">{t('welcome_title_2', 'Planner')}</span>
                    </h2>
                    <p className="text-stone-500 italic mt-2">{t('welcome_subtitle', 'तुमच्या स्वप्नातील लग्नाचे अचूक नियोजन')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-stone-100 no-print">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-stone-700 mb-2">{t('total_budget')}</label>
                                    <input type="number" className="border border-stone-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="उदा. 1000000" onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-stone-700 mb-2">{t('guests')}</label>
                                    <input type="number" className="border border-stone-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="उदा. 250" onChange={(e) => setFormData({...formData, guestCount: e.target.value})} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-stone-700 mb-2">{t('location_type')}</label>
                                    <select className="border border-stone-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-amber-500 outline-none" onChange={(e) => setFormData({...formData, locationType: e.target.value})}>
                                        <option value="Local">Local</option>
                                        <option value="Destination">Destination</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handlePlanBudget} disabled={loading} className="w-full mt-8 py-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg active:scale-95 transition-all disabled:bg-stone-400">
                                {loading ? t('loading_plan', 'AI प्लॅन तयार करत आहे...') : t('generate_plan')}
                            </button>
                        </div>

                        {plan && (
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="flex justify-end mb-4 no-print">
                                    <button onClick={handleDownload} className="bg-stone-800 text-white px-8 py-3 rounded-full shadow-xl hover:bg-black transition flex items-center gap-2 font-bold">
                                        📥 {t('save_pdf')}
                                    </button>
                                </div>

                                <div className="print-area bg-white border-2 border-stone-200 rounded-3xl p-10 shadow-sm">
                                    <div className="text-center mb-10 border-b-2 border-amber-100 pb-6">
                                        <h1 className="text-5xl font-extrabold text-amber-600 uppercase tracking-tighter italic">सप्तपदी</h1>
                                        <p className="text-stone-500 uppercase tracking-widest mt-2 font-semibold italic">{t('report_title', 'Wedding Budget Report')}</p>
                                    </div>

                                    <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm mb-10">
                                        <h3 className="text-2xl font-bold text-stone-800 mb-6 border-l-4 border-amber-500 pl-4">📊 {t('analysis_title', 'Budget Analysis')}</h3>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={plan.categories}
                                                        dataKey="amount"
                                                        nameKey="category"
                                                        cx="50%" cy="50%"
                                                        innerRadius={70} outerRadius={100}
                                                        paddingAngle={5}
                                                    >
                                                        {plan.categories.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#B45309', '#D97706', '#F59E0B', '#78716C', '#44403C', '#A8A29E'][index % 6]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                                    <Legend iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-stone-800 mb-8 border-l-4 border-amber-500 pl-4">📑 {t('breakdown_title', 'Detailed Breakdown')}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                        {plan.categories.map((item, index) => (
                                            <div key={index} className="bg-amber-50/20 p-6 rounded-2xl border border-amber-100 hover:bg-amber-50 transition-colors">
                                                <p className="text-xs uppercase font-black text-stone-400 mb-1">{item.category}</p>
                                                <p className="text-3xl font-black text-amber-700">₹{Number(item.amount).toLocaleString('en-IN')}</p>
                                                <p className="text-sm text-stone-600 mt-4 italic border-t pt-2 border-amber-100">{item.tip}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-stone-900 p-8 rounded-3xl text-white shadow-2xl">
                                        <h4 className="font-bold text-amber-400 text-xl mb-3 flex items-center gap-2">🧐 {t('expert_summary_title', 'Expert Summary')}</h4>
                                        <p className="text-stone-200 leading-relaxed italic text-lg">
                                            {typeof plan.summary === 'object' ? plan.summary.realism_assessment : plan.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 no-print">
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-stone-200 sticky top-10">
                            <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2 border-b pb-2">{t('history')}</h3>
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                {history.length === 0 ? (
                                    <p className="text-sm text-stone-400 italic text-center py-10">{t('no_history', 'अद्याप हिस्ट्री नाही')}</p>
                                ) : (
                                    history.map((item) => (
                                        <div key={item._id} onClick={() => setPlan(item.plan)} className="group relative p-4 rounded-xl border border-stone-100 bg-stone-50 hover:bg-amber-50 cursor-pointer transition-all hover:shadow-md">
                                            <button onClick={(e) => handleDelete(e, item._id)} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] z-10">✕</button>
                                            <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                <span className="font-bold text-amber-600 uppercase">{item.locationType}</span>
                                            </div>
                                            <p className="font-bold text-stone-700">₹{Number(item.totalBudget).toLocaleString('en-IN')}</p>
                                            <p className="text-[10px] text-stone-500 font-medium">{item.guestCount} {t('guests_label', 'Guests')}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPlanner;
