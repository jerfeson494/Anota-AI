'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Check, CreditCard, Building2, User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react';

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdFromUrl = searchParams.get('plano') || 'profissional';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    // Dados do restaurante
    nomeRestaurante: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    // Dados de pagamento
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvv: '',
  });

  const plans = {
    basico: {
      name: 'Básico',
      price: 'R$ 49',
      period: '/mês',
      features: [
        'Pedidos ilimitados',
        'Dashboard básico',
        'App mobile',
        'Suporte por email',
        '1 usuário',
      ],
    },
    profissional: {
      name: 'Profissional',
      price: 'R$ 99',
      period: '/mês',
      features: [
        'Pedidos ilimitados',
        'Dashboard completo',
        'App mobile customizado',
        'Suporte prioritário',
        'Até 5 usuários',
        'Relatórios avançados',
        'Integração WhatsApp',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: 'R$ 199',
      period: '/mês',
      features: [
        'Tudo do Profissional',
        'Usuários ilimitados',
        'API personalizada',
        'Suporte 24/7',
        'Suporte personalizado',
        'Integração por webhook',
        'Múltiplas lojas',
        'White label',
      ],
    },
  };

  // Garantir que o planId seja válido
  const validPlanId = (planIdFromUrl in plans) ? planIdFromUrl : 'profissional';
  const selectedPlan = plans[validPlanId as keyof typeof plans];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de pagamento e criação de conta
    console.log('Dados do formulário:', formData);
    console.log('Plano selecionado:', validPlanId);
    // Redirecionar para dashboard após sucesso
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                Anota.ai
              </span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do Plano */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Plano {selectedPlan.name}
              </h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {selectedPlan.price}
                </span>
                <span className="text-lg text-gray-600 mb-1">
                  {selectedPlan.period}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {selectedPlan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>7 dias grátis</span>
                  <span className="text-green-600 font-semibold">-{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total hoje</span>
                  <span>R$ 0,00</span>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Você será cobrado {selectedPlan.price} após o período de teste de 7 dias. Cartão de crédito necessário para validação.
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Cadastro */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                      step >= stepNumber
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        step > stepNumber ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Dados Pessoais */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados Pessoais</h2>
                      <p className="text-gray-600">Comece criando sua conta</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Senha
                      </label>
                      <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Mínimo 8 caracteres"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Confirmar Senha
                      </label>
                      <input
                        type="password"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Repita sua senha"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Dados do Restaurante */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados do Restaurante</h2>
                      <p className="text-gray-600">Informações do seu negócio</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Nome do Restaurante
                      </label>
                      <input
                        type="text"
                        name="nomeRestaurante"
                        value={formData.nomeRestaurante}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nome do seu restaurante"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="00.000.000/0000-00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Endereço Completo
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Rua, número, bairro"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Sua cidade"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado
                        </label>
                        <input
                          type="text"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="UF"
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Pagamento */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados de Pagamento</h2>
                      <p className="text-gray-600">Você não será cobrado nos primeiros 7 dias</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        name="numeroCartao"
                        value={formData.numeroCartao}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        name="nomeCartao"
                        value={formData.nomeCartao}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nome como está no cartão"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Validade
                        </label>
                        <input
                          type="text"
                          name="validadeCartao"
                          value={formData.validadeCartao}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="000"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-sm text-orange-800">
                        <strong>Garantia de 7 dias grátis:</strong> Você pode cancelar a qualquer momento durante o período de teste sem ser cobrado. Cartão necessário para validação.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all"
                    >
                      Voltar
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Finalizar Assinatura
                    </button>
                  )}
                </div>
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                Ao continuar, você concorda com nossos{' '}
                <a href="#" className="text-orange-600 hover:underline">Termos de Serviço</a>
                {' '}e{' '}
                <a href="#" className="text-orange-600 hover:underline">Política de Privacidade</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <CadastroContent />
    </Suspense>
  );
}
