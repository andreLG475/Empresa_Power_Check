
// Formata um CPF para: xxx.xxx.xxx-xx

export const formatCPF = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  
  if (cleaned.length <= 3) {
    return cleaned;
  }
  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  }
  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  }
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};


// Formata um CNPJ para: xx.xxx.xxx/xxxx-xx

export const formatCNPJ = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 14);
  
  if (cleaned.length <= 2) {
    return cleaned;
  }
  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  }
  if (cleaned.length <= 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
  }
  if (cleaned.length <= 12) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
  }
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
};


// Formata um telefone para: (xx) xxxxx-xxxx

export const formatTelefone = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  
  if (cleaned.length <= 2) {
    return cleaned;
  }
  if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

// Formata um CEP para: xxxxx-xxx

export const formatCEP = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};


// Formata uma data para dd/mm/yyyy

export const formatData = (value) => {
  if (!value) return '';
  
  // Se já está no formato dd/mm/yyyy, retorna
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }
  
  // Se é uma string com T (ISO format), extrai apenas a data
  if (value.includes('T')) {
    value = value.split('T')[0];
  }
  
  // Se está no formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  
  return value;
};

export const unformatValue = (value) => {
  return value.replace(/\D/g, '');
};
