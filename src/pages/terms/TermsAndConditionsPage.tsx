import { CaretLeft } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/ui/GlassCard";

const sections = [
  {
    title: "1. Aceptación de los Términos",
    content:
      "Al registrarte y utilizar los servicios de TallyBank, aceptas de forma libre, informada e inequívoca los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debes utilizar la plataforma.",
  },
  {
    title: "2. Descripción del Servicio",
    content:
      "TallyBank es una plataforma fintech que te permite gestionar cuentas digitales, realizar transferencias, administrar tarjetas de débito y acceder a servicios financieros de manera 100% digital. El servicio se proporciona a través de nuestra aplicación web y móvil.",
  },
  {
    title: "3. Elegibilidad y Registro",
    content:
      "Para utilizar TallyBank debes ser mayor de 18 años y contar con capacidad legal para celebrar contratos. Al registrarte, declara que la información proporcionada es veraz, completa y actualizada. TallyBank se reserva el derecho de verificar tu identidad y rechazar registros que no cumplan con los requisitos establecidos.",
  },
  {
    title: "4. Seguridad de la Cuenta",
    content:
      "Eres responsable de mantener la confidencialidad de tus credenciales de acceso (correo electrónico y contraseña). Cualquier actividad realizada desde tu cuenta será considerada como realizada por ti. Notifica de inmediato a TallyBank ante cualquier uso no autorizado de tu cuenta.",
  },
  {
    title: "5. Transacciones y Transferencias",
    content:
      "Todas las transacciones realizadas a través de la plataforma son definitivas e irreversibles, salvo en los casos previstos por la ley aplicable. TallyBank no se hace responsable por errores en los datos ingresados por el usuario al realizar una transferencia. Los tiempos de procesamiento pueden variar según el tipo de transacción y la entidad receptora.",
  },
  {
    title: "6. Tarjetas y Pagos",
    content:
      "Las tarjetas digitales emitidas por TallyBank están sujetas a los términos específicos de uso que se proporcionarán al momento de su activación. Puedes congelar o descongelar tu tarjeta en cualquier momento desde la configuración de la aplicación. Los pagos internacionales pueden estar sujetos a comisiones adicionales según la política vigente.",
  },
  {
    title: "7. Comisiones y Tarifas",
    content:
      "TallyBank se compromete a informar de manera transparente todas las comisiones y tarifas asociadas a sus servicios. Las comisiones vigentes estarán disponibles en la sección de Configuración de la aplicación. TallyBank se reserva el derecho de modificar las tarifas con un aviso previo de al menos 30 días.",
  },
  {
    title: "8. Protección de Datos Personales",
    content:
      "TallyBank trata tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México) y las regulaciones aplicables. Tus datos serán utilizados exclusivamente para la prestación del servicio, verificación de identidad, cumplimiento normativo y mejora de la experiencia. No compartimos tu información con terceros sin tu consentimiento, salvo obligación legal.",
  },
  {
    title: "9. Verificación de Identidad (KYC)",
    content:
      "Como parte del cumplimiento normativo, TallyBank podrá solicitar documentación adicional para verificar tu identidad (proceso Know Your Customer). El acceso a ciertos servicios podrá estar condicionado a la completación satisfactoria del proceso de verificación KYC.",
  },
  {
    title: "10. Uso Prohibido",
    content:
      "Está prohibido utilizar la plataforma para actividades ilícitas, lavado de dinero, financiamiento al terrorismo, fraude o cualquier actividad que contravenga la ley. TallyBank monitorea las transacciones para detectar operaciones inusuales y podrá bloquear o cerrar cuentas que presenten sospechas fundadas.",
  },
  {
    title: "11. Responsabilidad y Limitaciones",
    content:
      "TallyBank no será responsable por daños indirectos, pérdidas de beneficios o perjuicios derivados del uso de la plataforma, interrupciones del servicio por mantenimiento o causas de fuerza mayor. La responsabilidad máxima de TallyBank se limitará al monto de las comisiones pagadas por el usuario en los últimos 6 meses.",
  },
  {
    title: "12. Modificaciones",
    content:
      "TallyBank se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán notificadas a través de la aplicación o por correo electrónico con al menos 15 días de anticipación. El uso continuado de la plataforma después de la vigencia de las modificaciones constituirá la aceptación de las mismas.",
  },
  {
    title: "13. Terminación del Servicio",
    content:
      "Puedes solicitar la cancelación de tu cuenta en cualquier momento a través de Soporte 24/7. TallyBank podrá suspender o cancelar cuentas que incumplan estos términos, previa notificación al usuario. Los fondos disponibles serán transferidos a la cuenta bancaria registrada dentro de los 10 días hábiles siguientes a la cancelación.",
  },
  {
    title: "14. Ley Aplicable y Jurisdicción",
    content:
      "Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia será sometida a los tribunales competentes de la Ciudad de México, renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de domicilio presente o futuro.",
  },
  {
    title: "15. Contacto",
    content:
      "Para cualquier consulta sobre estos Términos y Condiciones, puedes contactarnos a través de Soporte 24/7 disponible en la sección de Perfil de la aplicación o escribir a soporte@tallybank.com.",
  },
];

export function TermsAndConditionsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary">
      {/* Background glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-80 h-80 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/30 transition-colors"
            aria-label="Volver"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary">
              Términos y Condiciones
            </h1>
            <p className="text-xs text-text-muted">TallyBank v1.0</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-12 space-y-6">
        {/* Intro */}
        <GlassCard className="p-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            Última actualización: 22 de agosto de 2026. Estos Términos y
            Condiciones regulan el uso de la plataforma y servicios ofrecidos
            por <span className="text-primary font-semibold">TallyBank</span>.
            Al crear una cuenta, aceptas estos términos en su totalidad.
          </p>
        </GlassCard>

        {/* Sections */}
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

        {/* Footer */}
        <GlassCard className="p-5 mt-8">
          <p className="text-xs text-text-muted text-center leading-relaxed">
            Al continuar usando TallyBank, confirmas que has leído, comprendido
            y aceptado estos Términos y Condiciones. Si tienes dudas, contáctate
            con Soporte 24/7.
          </p>
        </GlassCard>

        <button
          onClick={() => navigate(-1)}
          className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm hover:bg-primary-accent active:scale-[0.98] transition-all"
        >
          Volver al registro
        </button>
      </main>
    </div>
  );
}
