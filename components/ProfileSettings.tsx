
import React, { useState, useRef } from 'react';
import { UserProfile, Tone } from '../types';
import { User, Stethoscope, FileText, Phone, Mail, Globe, MapPin, Instagram, Camera, Save, CheckCircle2 } from 'lucide-react';

interface ProfileSettingsProps {
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ currentProfile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(currentProfile);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn pb-24 lg:pb-0">
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Seu Perfil Profissional</h2>
            <p className="text-slate-500 text-sm">Personalize como a IA e seus pacientes veem você.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Photo & Basic Info */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-200 shadow-inner">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nome de Exibição</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => handleChange('name', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                      placeholder="Dr. Nome Sobrenome"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Especialidade</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.specialty} 
                        onChange={e => handleChange('specialty', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                        placeholder="Ex: Joelho e Ombro"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CRM / RQE</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.crm} 
                        onChange={e => handleChange('crm', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                        placeholder="00000 / SP"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Persona Config */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Configuração da IA</h3>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tom de Voz Padrão</label>
                <select 
                  value={formData.defaultTone}
                  onChange={e => handleChange('defaultTone', e.target.value as Tone)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm"
                >
                  {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mini Bio (Para Contexto da IA)</label>
                <textarea 
                  value={formData.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm resize-none h-24"
                  placeholder="Ex: Foco em cirurgia minimamente invasiva, medicina esportiva e reabilitação acelerada..."
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Contatos Públicos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp / Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input type="text" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="5511999999999" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="contato@medico.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input type="text" value={formData.website} onChange={e => handleChange('website', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="www.seusite.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instagram (@)</label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input type="text" value={formData.instagram} onChange={e => handleChange('instagram', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="@seu.perfil" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Endereço do Consultório</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input type="text" value={formData.address} onChange={e => handleChange('address', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Rua Exemplo, 123 - Sala 404" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'Perfil Atualizado!' : 'Salvar Alterações'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
