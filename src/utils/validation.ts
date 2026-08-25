/**
 * Utilidades de validación compartidas para formularios.
 * Incluye protección contra inyección SQL en el cliente
 * (la defensa real siempre debe estar en el backend con queries parametrizadas).
 */

/** Patrones comunes de inyección SQL */
const SQL_PATTERNS = [
  /\b(OR|AND)\b\s+\d+\s*=\s*\d+/i, // OR 1=1, AND 1=1
  /\bUNION\b[\s\S]*?\bSELECT\b/i, // UNION SELECT
  /\bSELECT\b[\s\S]*?\bFROM\b/i, // SELECT ... FROM
  /\bINSERT\s+INTO\b/i, // INSERT INTO
  /\bDROP\s+(TABLE|DATABASE)\b/i, // DROP TABLE / DROP DATABASE
  /\bDELETE\s+FROM\b/i, // DELETE FROM
  /\bUPDATE\s+\w+\s+SET\b/i, // UPDATE ... SET
  /\bEXEC(UTE)?\b/i, // EXEC / EXECUTE
  /\bWAITFOR\s+DELAY\b/i, // WAITFOR DELAY (time-based blind SQLi)
  /(--|\/\*|\*\/|;)/, // Comentarios SQL y separadores de statements
  /'\s*(OR|AND)\s*'/i, // ' OR '
];

/** Detecta patrones de inyección SQL en un valor */
export function containsSqlInjection(value: string): boolean {
  return SQL_PATTERNS.some((pattern) => pattern.test(value));
}

/** Regex para nombre de usuario: solo letras, espacios, acentos, guiones y puntos */
export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'.-]+$/;

/** Regex para email */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Regex para teléfono: +, dígitos, espacios, guiones y paréntesis */
export const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;

/** Regex para contraseñas fuertes: al menos una letra y un número */
export const PASSWORD_STRONG_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

/** Mensajes de error compartidos */
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  sqlInjection: 'El valor contiene caracteres no permitidos',
  nameInvalid: 'Solo se permiten letras y espacios',
  nameShort: 'El nombre debe tener al menos 3 caracteres',
  nameLong: 'El nombre no puede exceder 60 caracteres',
  emailInvalid: 'Ingresa un correo electrónico válido',
  emailLong: 'El correo no puede exceder 255 caracteres',
  phoneInvalid: 'Ingresa un número de teléfono válido',
  passwordRequired: 'La contraseña es obligatoria',
  passwordMin: 'La contraseña debe tener al menos 8 caracteres',
  passwordMax: 'La contraseña no puede exceder 128 caracteres',
  passwordWeak: 'Debe contener al menos una letra y un número',
  passwordsDontMatch: 'Las contraseñas no coinciden',
  samePassword: 'La nueva contraseña debe ser diferente a la actual',
} as const;

/**
 * Tipo estructural de reglas compatible con `RegisterOptions` de
 * react-hook-form para cualquier campo. Evita la fricción de genéricos
 * al reutilizar reglas entre formularios.
 */
export type FormRules = {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  validate?: Record<string, (value: unknown) => boolean | string>;
  setValueAs?: (value: unknown) => unknown;
};

/**
 * Regla anti-SQL inyección reutilizable para react-hook-form.
 */
function sqlSafeRule(): NonNullable<FormRules["validate"]> {
  return {
    notSqlInjection: (value) =>
      !value ||
      !containsSqlInjection(String(value)) ||
      VALIDATION_MESSAGES.sqlInjection,
  };
}

/** Reglas para nombre de usuario (react-hook-form) */
export function nameRules(): FormRules {
  return {
    required: VALIDATION_MESSAGES.required,
    minLength: { value: 3, message: VALIDATION_MESSAGES.nameShort },
    maxLength: { value: 60, message: VALIDATION_MESSAGES.nameLong },
    validate: {
      ...sqlSafeRule(),
      validName: (value) =>
        NAME_REGEX.test(String(value).trim()) || VALIDATION_MESSAGES.nameInvalid,
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  };
}

/** Reglas para correo electrónico (react-hook-form) */
export function emailRules(): FormRules {
  return {
    required: VALIDATION_MESSAGES.required,
    maxLength: { value: 255, message: VALIDATION_MESSAGES.emailLong },
    validate: {
      ...sqlSafeRule(),
      validEmail: (value) =>
        EMAIL_REGEX.test(String(value).trim()) ||
        VALIDATION_MESSAGES.emailInvalid,
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  };
}

/** Reglas para teléfono (react-hook-form) */
export function phoneRules(required = true): FormRules {
  return {
    required: required ? VALIDATION_MESSAGES.required : false,
    validate: {
      ...sqlSafeRule(),
      validPhone: (value) =>
        PHONE_REGEX.test(String(value)) || VALIDATION_MESSAGES.phoneInvalid,
    },
  };
}

/** Reglas para contraseña nueva (react-hook-form).
 *  `getOtherPassword` permite validar que coincida con la confirmación.
 *  `otherFieldMessage` personaliza el mensaje si no coincide. */
export function passwordRules(
  getOtherPassword?: () => string,
  otherFieldMessage?: string,
): FormRules {
  return {
    required: VALIDATION_MESSAGES.passwordRequired,
    minLength: { value: 8, message: VALIDATION_MESSAGES.passwordMin },
    maxLength: { value: 128, message: VALIDATION_MESSAGES.passwordMax },
    validate: {
      ...sqlSafeRule(),
      strongEnough: (value) =>
        PASSWORD_STRONG_REGEX.test(String(value)) ||
        VALIDATION_MESSAGES.passwordWeak,
      matchesOther: (value) => {
        if (!getOtherPassword) return true;
        return (
          String(value) === getOtherPassword() ||
          (otherFieldMessage ?? VALIDATION_MESSAGES.passwordsDontMatch)
        );
      },
    },
  };
}

/** Reglas para confirmación de contraseña (react-hook-form) */
export function confirmPasswordRules(getOriginal: () => string): FormRules {
  return {
    required: VALIDATION_MESSAGES.passwordRequired,
    validate: {
      matchesOriginal: (value) =>
        String(value) === getOriginal() ||
        VALIDATION_MESSAGES.passwordsDontMatch,
    },
  };
}

/** Reglas para campos de texto simples requeridos y seguros
 *  (ej. contraseña actual o contraseña en login) */
export function simpleTextRules(): FormRules {
  return {
    required: VALIDATION_MESSAGES.required,
    validate: sqlSafeRule(),
  };
}
