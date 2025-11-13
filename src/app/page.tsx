'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, Zap, Users, BarChart3, Smartphone, Headphones, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 49',
      period: '/mês',
      description: 'Ideal para começar',
      features: [
        'Pedidos ilimitados',
        'Dashboard básico',
        'App mobile',
        'Suporte por email',
        '1 usuário',
      ],
      highlighted: false,
      color: 'from-gray-500 to-gray-600',
      planId: 'basico',
    },
    {
      name: 'Profissional',
      price: 'R$ 99',
      period: '/mês',
      description: 'Mais popular',
      features: [
        'Pedidos ilimitados',
        'Dashboard completo',
        'App mobile customizado',
        'Suporte prioritário',
        'Até 5 usuários',
        'Relatórios avançados',
        'Integração WhatsApp',
      ],
      highlighted: true,
      color: 'from-orange-500 to-amber-600',
      planId: 'profissional',
    },
    {
      name: 'Enterprise',
      price: 'R$ 199',
      period: '/mês',
      description: 'Para grandes operações',
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
      highlighted: false,
      color: 'from-purple-500 to-pink-600',
      planId: 'enterprise',
    },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'App Mobile Completo',
      description: 'Aplicativo nativo para seus clientes fazerem pedidos com facilidade',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Gerencie tudo em tempo real com relatórios e métricas detalhadas',
    },
    {
      icon: Zap,
      title: 'Integração WhatsApp',
      description: 'Receba e gerencie pedidos direto pelo WhatsApp com IA',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Adicione colaboradores e controle permissões de acesso',
    },
    {
      icon: Shield,
      title: 'Pagamentos Seguros',
      description: 'PIX, cartão e outros métodos integrados com segurança',
    },
    {
      icon: Headphones,
      title: 'Suporte Dedicado',
      description: 'Time especializado pronto para ajudar quando precisar',
    },
  ];

  const handleSubscribe = (planId: string) => {
    router.push(`/cadastro?plano=${planId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 text-gray-700 font-semibold hover:text-orange-500 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('plans')?.offsetTop || 0, behavior: 'smooth' })}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Assinar Agora
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-8">
            <Zap className="w-4 h-4" />
            Sistema completo de gestão
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme seu
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              restaurante digital
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Gerencie pedidos, cardápio e clientes em um só lugar. 
            Com app mobile, dashboard web e integração WhatsApp com IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: document.getElementById('plans')?.offsetTop || 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Assinar Agora
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.getElementById('plans')?.offsetTop || 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all"
            >
              Ver Planos
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos completos para gerenciar seu negócio com eficiência e profissionalismo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Planos flexíveis que crescem com seu negócio. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-2xl scale-105 border-4 border-orange-400'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-orange-300'
                } transition-all hover:scale-105`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-orange-600 rounded-full text-sm font-bold shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg mb-2 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'bg-white/20' : 'bg-orange-100'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-orange-600'}`} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.planId)}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    plan.highlighted
                      ? 'bg-white text-orange-600 hover:bg-gray-50 hover:shadow-xl'
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-xl hover:scale-105'
                  }`}
                >
                  Assinar Agora
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-12">
            Todos os planos incluem 7 dias de teste grátis. Cartão de crédito necessário.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-500 to-amber-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">5.000+</div>
              <div className="text-xl text-white/80">Pedidos Processados</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">200+</div>
              <div className="text-xl text-white/80">Restaurantes Ativos</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">99.9%</div>
              <div className="text-xl text-white/80">Uptime Garantido</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-xl text-white/80">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a centenas de restaurantes que já modernizaram sua gestão
          </p>
          <button
            onClick={() => window.scrollTo({ top: document.getElementById('plans')?.offsetTop || 0, behavior: 'smooth' })}
            className="px-12 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Assinar Agora
          </button>
          <p className="text-gray-500 mt-4 text-sm">
            7 dias grátis • Cancele quando quiser • Cartão de crédito necessário
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Anota.ai</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Sistema completo de gestão de pedidos para restaurantes e lanchonetes. 
                Modernize seu negócio hoje mesmo.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#plans" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © 2024 Anota.ai. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
