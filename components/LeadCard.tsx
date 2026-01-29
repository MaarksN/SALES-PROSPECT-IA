
import React from 'react';
import { Lead } from '../types';
import { Icons } from '../constants';

interface LeadCardProps {
    lead: Lead;
    style?: React.CSSProperties;
    onSelect: (lead: Lead) => void;
    onWhatsApp: (lead: Lead) => void;
    onCRMExport: (lead: Lead) => void;
    openGoogleMaps: (location: string, company: string) => void;
    stringToColor: (str: string) => string;
}

export const LeadCard: React.FC<LeadCardProps> = ({
    lead,
    style,
    onSelect,
    onWhatsApp,
    onCRMExport,
    openGoogleMaps,
    stringToColor
}) => {
    return (
        <div style={style} className="pb-4">
            <div
                className={`group relative bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] border transition-all duration-300 hover:scale-[1.01] h-full ${
                    lead.score > 80
                    ? 'border-amber-400/50 dark:border-amber-500/50 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)]'
                    : 'border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl'
                }`}
            >
                {/* High Score Badge */}
                {lead.score > 80 && (
                    <div className="absolute -top-3 right-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10 ring-4 ring-white dark:ring-[#05050A]">
                        <Icons.Sparkles className="w-3 h-3" /> Ouro
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left: Avatar & Info */}
                    <div className="flex gap-6 items-start flex-1">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0"
                            style={{ backgroundColor: stringToColor(lead.companyName) }}
                        >
                            {lead.companyName.charAt(0)}
                        </div>

                        <div className="space-y-2 min-w-0">
                            <h3 className="text-xl font-bold dark:text-white truncate group-hover:text-purple-500 transition-colors">
                                {lead.companyName}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5 truncate max-w-[120px]">🏢 {lead.sector}</span>
                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5 truncate max-w-[120px]">📍 {lead.location}</span>
                            </div>

                            {(lead as any).matchReason && (
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 italic line-clamp-2">
                                    "{(lead as any).matchReason}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions & Score */}
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                        <div className="text-right">
                            <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {lead.score}<span className="text-sm text-slate-300 dark:text-slate-600">/100</span>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full justify-end">
                            <button
                                onClick={() => onWhatsApp(lead)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition-all"
                                title="WhatsApp"
                            >
                                <Icons.Phone className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onCRMExport(lead)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 hover:bg-orange-100 transition-all"
                                title="CRM"
                            >
                                <Icons.Upload className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onSelect(lead)}
                                className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#0B1120] dark:bg-white dark:text-[#0B1120] hover:opacity-90 transition-all shadow-lg"
                            >
                                Ver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
