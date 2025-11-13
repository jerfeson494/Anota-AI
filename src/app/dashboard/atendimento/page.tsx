'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  Phone,
  Send,
  User,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: Date;
}

interface Automation {
  id: string;
  trigger: string;
  message: string;
  enabled: boolean;
}

interface WhatsAppConfig {
  connected: boolean;
  phoneNumber: string;
  qrCode?: string;
}

export default function AtendimentoPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'config' | 'automations'>('chat');
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    connected: false,
    phoneNumber: '',
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      content: 'Olá, gostaria de fazer um pedido',
      timestamp: new Date(),
    },
    {
      id: '2',
      sender: 'bot',
      content: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje? 😊',
      timestamp: new Date(),
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  
  // Configurações da IA
  const [aiConfig, setAiConfig] = useState({
    tone: 'friendly',
    autoRespond: true,
    model: 'gpt-4o',
    temperature: 0.7,
    systemPrompt: 'Você é um assistente de atendimento de um restaurante. Seja cordial, prestativo e ajude os clientes com pedidos, informações do cardápio e dúvidas gerais.',
  });
  
  // Automações
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      trigger: 'Mensagem de boas-vindas',
      message: 'Olá! Bem-vindo ao nosso restaurante. Como posso ajudá-lo hoje?',
      enabled: true,
    },
    {
      id: '2',
      trigger: 'Pedido recebido',
      message: 'Seu pedido #{orderNumber} foi recebido com sucesso! Estamos preparando com carinho.',
      enabled: true,
    },
    {
      id: '3',
      trigger: 'Pedido em preparo',
      message: 'Seu pedido #{orderNumber} está sendo preparado. Em breve estará pronto!',
      enabled: true,
    },
    {
      id: '4',
      trigger: 'Pedido saiu para entrega',
      message: 'Seu pedido #{orderNumber} saiu para entrega! Chegará em aproximadamente 30 minutos.',
      enabled: true,
    },
    {
      id: '5',
      trigger: 'Pedido entregue',
      message: 'Seu pedido foi entregue! Esperamos que aproveite. Por favor, avalie nosso atendimento: [link]',
      enabled: true,
    },
    {
      id: '6',
      trigger: 'Enviar cardápio',
      message: 'Aqui está nosso cardápio completo onde você pode fazer seu pedido: https://seu-dominio.com/cardapio - Faça seu pedido diretamente pelo link e receba uma notificação no WhatsApp quando estiver pronto!',
      enabled: true,
    },
  ]);
  
  const [editingAutomation, setEditingAutomation] = useState<string | null>(null);
  
  // Conectar WhatsApp
  const handleConnectWhatsApp = () => {
    if (!whatsappConfig.phoneNumber) {
      toast.error('Por favor, insira um número de telefone');
      return;
    }
    
    // Simular conexão
    toast.loading('Conectando ao WhatsApp...', { id: 'whatsapp-connect' });
    
    setTimeout(() => {
      setWhatsappConfig({
        ...whatsappConfig,
        connected: true,
      });
      toast.success('WhatsApp conectado com sucesso!', { id: 'whatsapp-connect' });
    }, 2000);
  };
  
  // Desconectar WhatsApp
  const handleDisconnectWhatsApp = () => {
    setWhatsappConfig({
      connected: false,
      phoneNumber: '',
    });
    toast.success('WhatsApp desconectado');
  };
  
  // Enviar mensagem
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: isManualMode ? 'agent' : 'bot',
      content: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simular resposta automática se não estiver em modo manual
    if (!isManualMode) {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: 'Entendi! Deixe-me ajudá-lo com isso.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };
  
  // Enviar cardápio do sistema
  const handleSendMenu = () => {
    const menuAutomation = automations.find(auto => auto.id === '6');
    if (!menuAutomation) return;
    
    const menuMessage: Message = {
      id: Date.now().toString(),
      sender: isManualMode ? 'agent' : 'bot',
      content: menuAutomation.message,
      timestamp: new Date(),
    };
    
    setMessages([...messages, menuMessage]);
    toast.success('Cardápio enviado com sucesso!');
  };
  
  // Salvar configurações da IA
  const handleSaveAIConfig = () => {
    toast.success('Configurações da IA salvas com sucesso!');
  };
  
  // Alternar automação
  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
    toast.success('Automação atualizada');
  };
  
  // Salvar automação editada
  const handleSaveAutomation = (id: string, newMessage: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id ? { ...auto, message: newMessage } : auto
      )
    );
    setEditingAutomation(null);
    toast.success('Automação salva com sucesso!');
  };
  
  // Adicionar nova automação
  const handleAddAutomation = () => {
    const newAutomation: Automation = {
      id: Date.now().toString(),
      trigger: 'Nova automação',
      message: 'Digite sua mensagem aqui',
      enabled: true,
    };
    setAutomations([...automations, newAutomation]);
    setEditingAutomation(newAutomation.id);
  };
  
  // Deletar automação
  const handleDeleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(auto => auto.id !== id));
    toast.success('Automação removida');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Atendimento</h1>
        <p className="text-gray-600">Gerencie o atendimento via WhatsApp com IA integrada</p>
      </div>

      {/* Status WhatsApp */}
      <div className={`rounded-2xl p-6 border-2 ${
        whatsappConfig.connected 
          ? 'bg-green-50 border-green-200' 
          : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              whatsappConfig.connected ? 'bg-green-500' : 'bg-orange-500'
            }`}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {whatsappConfig.connected ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}
              </h3>
              <p className="text-sm text-gray-600">
                {whatsappConfig.connected 
                  ? `Número: ${whatsappConfig.phoneNumber}` 
                  : 'Conecte seu WhatsApp para começar'}
              </p>
            </div>
          </div>
          {whatsappConfig.connected ? (
            <button
              onClick={handleDisconnectWhatsApp}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Desconectar
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'chat'
              ? 'text-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat
          </div>
          {activeTab === 'chat' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'config'
              ? 'text-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações
          </div>
          {activeTab === 'config' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('automations')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'automations'
              ? 'text-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Automações
          </div>
          {activeTab === 'automations' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cliente</h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsManualMode(!isManualMode)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    isManualMode
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isManualMode ? 'Modo Manual' : 'Modo Automático'}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gray-100 text-gray-900'
                        : message.sender === 'bot'
                        ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-gray-500' : 'text-white/70'
                    }`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* IA Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Assistente IA</h3>
                  <p className="text-xs text-gray-500">
                    {aiConfig.autoRespond ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Modelo:</span>
                  <span className="font-semibold text-gray-900">{aiConfig.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tom:</span>
                  <span className="font-semibold text-gray-900 capitalize">{aiConfig.tone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperatura:</span>
                  <span className="font-semibold text-gray-900">{aiConfig.temperature}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleSendMenu}
                  className="w-full px-4 py-2 bg-gradient-to-br from-orange-500 to-amber-600 hover:shadow-lg text-white rounded-xl text-sm font-semibold transition-all text-left flex items-center justify-between group"
                >
                  <span>Enviar Cardápio do Sistema</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors text-left">
                  Status do Pedido
                </button>
                <button className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors text-left">
                  Horário de Funcionamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WhatsApp Config */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Configuração WhatsApp</h3>
            </div>

            {!whatsappConfig.connected ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número do WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={whatsappConfig.phoneNumber}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, phoneNumber: e.target.value })}
                    placeholder="+55 11 99999-9999"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <button
                  onClick={handleConnectWhatsApp}
                  className="w-full px-4 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Conectar WhatsApp
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Ao conectar, você receberá um QR Code para escanear no WhatsApp
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Conectado com sucesso!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Número: {whatsappConfig.phoneNumber}
                  </p>
                </div>
                
                <button
                  onClick={handleDisconnectWhatsApp}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Desconectar
                </button>
              </div>
            )}
          </div>

          {/* IA Config */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Configuração da IA</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Modelo de IA
                </label>
                <select
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="gpt-4o">GPT-4o (Recomendado)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tom de Voz
                </label>
                <select
                  value={aiConfig.tone}
                  onChange={(e) => setAiConfig({ ...aiConfig, tone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="friendly">Amigável</option>
                  <option value="professional">Profissional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Temperatura ({aiConfig.temperature})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Controla a criatividade das respostas (0 = preciso, 1 = criativo)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prompt do Sistema
                </label>
                <textarea
                  value={aiConfig.systemPrompt}
                  onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">Resposta Automática</p>
                  <p className="text-xs text-gray-500">IA responde automaticamente</p>
                </div>
                <button
                  onClick={() => setAiConfig({ ...aiConfig, autoRespond: !aiConfig.autoRespond })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    aiConfig.autoRespond ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      aiConfig.autoRespond ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleSaveAIConfig}
                className="w-full px-4 py-3 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automations' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Automações de Mensagens</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure mensagens automáticas para diferentes eventos
              </p>
            </div>
            <button
              onClick={handleAddAutomation}
              className="px-4 py-2 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Automação
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {automations.map((automation) => (
              <div key={automation.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      automation.enabled ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {automation.enabled ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{automation.trigger}</h4>
                      {editingAutomation === automation.id ? (
                        <textarea
                          defaultValue={automation.message}
                          onBlur={(e) => handleSaveAutomation(automation.id, e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">{automation.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingAutomation(automation.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAutomation(automation.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleAutomation(automation.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        automation.enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={automation.enabled ? 'Desativar' : 'Ativar'}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          automation.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
