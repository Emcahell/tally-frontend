import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeft, FileText, Warning } from "phosphor-react";
import { GlassCard } from "../../components/ui/GlassCard";

const termsSections = [
  {
    title: "1. Aceptación de los Términos",
    content:
      "Al registrarte y utilizar los servicios de Tally, aceptas de forma libre, informada e inequívoca los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debes utilizar la plataforma.",
  },
  {
    title: "2. Descripción del Servicio",
    content:
      "Tally es una plataforma fintech que te permite gestionar cuentas digitales, realizar transferencias, administrar tarjetas de débito y acceder a servicios financieros de manera 100% digital. El servicio se proporciona a través de nuestra aplicación web y móvil.",
  },
  {
    title: "3. Elegibilidad y Registro",
    content:
      "Para utilizar Tally debes ser mayor de 18 años y contar con capacidad legal para celebrar contratos. Al registrarte, declara que la información proporcionada es veraz, completa y actualizada. Tally se reserva el derecho de verificar tu identidad y rechazar registros que no cumplan con los requisitos establecidos.",
  },
  {
    title: "4. Seguridad de la Cuenta",
    content:
      "Eres responsable de mantener la confidencialidad de tus credenciales de acceso (correo electrónico y contraseña). Cualquier actividad realizada desde tu cuenta será considerada como realizada por ti. Notifica de inmediato a Tally ante cualquier uso no autorizado de tu cuenta.",
  },
  {
    title: "5. Transacciones y Transferencias",
    content:
      "Todas las transacciones realizadas a través de la plataforma son definitivas e irreversibles, salvo en los casos previstos por la ley aplicable. Tally no se hace responsable por errores en los datos ingresados por el usuario al realizar una transferencia. Los tiempos de procesamiento pueden variar según el tipo de transacción y la entidad receptora.",
  },
  {
    title: "6. Tarjetas y Pagos",
    content:
      "Las tarjetas digitales emitidas por Tally están sujetas a los términos específicos de uso que se proporcionarán al momento de su activación. Puedes congelar o descongelar tu tarjeta en cualquier momento desde la configuración de la aplicación. Los pagos internacionales pueden estar sujetos a comisiones adicionales según la política vigente.",
  },
  {
    title: "7. Comisiones y Tarifas",
    content:
      "Tally se compromete a informar de manera transparente todas las comisiones y tarifas asociadas a sus servicios. Las comisiones vigentes estarán disponibles en la sección de Configuración de la aplicación. Tally se reserva el derecho de modificar las tarifas con un aviso previo de al menos 30 días.",
  },
  {
    title: "8. Protección de Datos Personales",
    content:
      "Tally trata tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y las regulaciones aplicables. Tus datos serán utilizados exclusivamente para la prestación del servicio, verificación de identidad, cumplimiento normativo y mejora de la experiencia. No compartimos tu información con terceros sin tu consentimiento, salvo obligación legal.",
  },
  {
    title: "9. Uso Prohibido",
    content:
      "Está prohibido utilizar la plataforma para actividades ilícitas, lavado de dinero, financiamiento al terrorismo, fraude o cualquier actividad que contravenga la ley. Tally monitorea las transacciones para detectar operaciones inusuales y podrá bloquear o cerrar cuentas que presenten sospechas fundadas.",
  },
  {
    title: "10. Responsabilidad y Limitaciones",
    content:
      "Tally no será responsable por daños indirectos, pérdidas de beneficios o perjuicios derivados del uso de la plataforma, interrupciones del servicio por mantenimiento o causas de fuerza mayor. La responsabilidad máxima de Tally se limitará al monto de las comisiones pagadas por el usuario en los últimos 6 meses.",
  },
  {
    title: "11. Modificaciones",
    content:
      "Tally se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán notificadas a través de la aplicación o por correo electrónico con al menos 15 días de anticipación. El uso continuado de la plataforma después de la vigencia de las modificaciones constituirá la aceptación de las mismas.",
  },
  {
    title: "12. Terminación del Servicio",
    content:
      "Tally podrá suspender o cancelar cuentas que incumplan estos términos, previa notificación al usuario. Los fondos disponibles serán transferidos a la cuenta bancaria registrada dentro de los 10 días hábiles siguientes a la cancelación.",
  },
  {
    title: "13. Contacto",
    content:
      "Para cualquier consulta sobre estos Términos y Condiciones, puedes contactarnos a través de Soporte disponible en la sección de Perfil de la aplicación o escribir a mrmarinmfl@gmail.com",
  },
];

const disclaimerSections = [
  {
    title: "1. Proyecto ficticio y educativo",
    content:
      "Tally es un proyecto ficticio creado exclusivamente con fines educativos. Esta aplicación, incluyendo su landing page y panel de usuario, fue desarrollada para aprender y practicar habilidades de desarrollo de software, diseño de interfaces de usuario y arquitectura de aplicaciones web.",
  },
  {
    title: "2. No representamos una empresa real",
    content:
      'Tally no es una entidad financiera, banco, empresa de tecnología ni organización de ningún tipo. No estamos registrados ante ninguna autoridad financiera o regulatoria. El nombre "Tally" y todos los elementos visuales, textos y funcionalidades son parte de una simulación educativa.',
  },
  {
    title: "3. Dinero y transacciones ficticias",
    content:
      "Todo el dinero mostrado dentro de la plataforma es totalmente ficticio. Las transferencias, saldos, tarjetas y cualquier otra operación financiera son simulaciones que no tienen valor en el mundo real. Los usuarios pueden crear cuentas, hacer transferencias y gestionar su \"dinero\" sin ningún riesgo financiero.",
  },
  {
    title: "4. Nunca pedimos dinero real",
    content:
      "En ningún momento solicitaremos a los usuarios que depositen dinero real en cuentas bancarias o servidores, envíen transferencias, criptomonedas o cualquier tipo de activo financiero, proporcionen información financiera sensible como números de tarjeta reales, o realicen inversiones o compren productos financieros a través de la plataforma.",
  },
  {
    title: "5. Reseñas y testimonios ficticios",
    content:
      "Las reseñas, calificaciones y testimonios mostrados en la landing page son completamente ficticios y fueron creados para fines ilustrativos. No representan opiniones reales de usuarios ni experiencias verificadas.",
  },
  {
    title: "6. Uso de la aplicación",
    content:
      "La aplicación del banco está diseñada para ser utilizada como un entorno de práctica. Los usuarios pueden explorar funcionalidades como registro de cuentas, transferencias y gestión de tarjetas, todo dentro de un entorno seguro y sin consecuencias reales. El uso de esta plataforma es completamente bajo su propio criterio y responsabilidad.",
  },
  {
    title: "7. Propósito del proyecto",
    content:
      "El único propósito de Tally es entretener y como desarrolladores practicar nuestras habilidades técnicas. Este proyecto demuestra capacidades en desarrollo frontend, backend, diseño de interfaces y arquitectura de software moderna. Si tienes preguntas sobre el proyecto o quieres colaborar, no dudes en contactarnos.",
  },
];

type Tab = "terms" | "disclaimer";

export function InformationPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("terms");

  const sections = tab === "terms" ? termsSections : disclaimerSections;

  return (
    <div className="min-h-dvh relative">
      {/* Glow backgrounds */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-10 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Volver"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <h1 className="text-base font-bold text-text-primary">Información</h1>
        </header>

        <main className="px-5 space-y-6">
          {/* Tab Selector */}
          <div className="flex gap-2 p-1 rounded-2xl bg-bg-surface border border-border">
            <button
              onClick={() => setTab("terms")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                tab === "terms"
                  ? "bg-primary text-bg-deep"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <FileText size={14} weight="bold" />
              Términos
            </button>
            <button
              onClick={() => setTab("disclaimer")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                tab === "disclaimer"
                  ? "bg-primary text-bg-deep"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Warning size={14} weight="bold" />
              Disclaimer
            </button>
          </div>

          {/* Content */}
          <GlassCard className="p-5">
            <p className="text-xs text-text-muted leading-relaxed">
              Última actualización: 22 de agosto de 2026.
            </p>
          </GlassCard>

          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-sm font-bold text-text-primary tracking-wide">
                {section.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <GlassCard className="p-5 mt-4">
            <p className="text-xs text-text-muted text-center leading-relaxed">
              {tab === "terms"
                ? "Al continuar usando Tally, confirmas que has leído, comprendido y aceptado estos Términos y Condiciones."
                : "Este proyecto es ficticio y educativo. No se maneja dinero real ni se representa una empresa real."}
            </p>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
