class LocaleBrUtil {

  isValidCpfCnpj = (documentNumber: string) => {
    if (!documentNumber.trim()) return false
    if (documentNumber.trim().length <= 11) {
      return this.isValidCpf(documentNumber)
    } else {
      return this.isValidCnpj(documentNumber)
    }
  }

  isValidCpf = (documentNumber: string) => {
    if (!documentNumber.trim() || 
        documentNumber.trim().length != 11 ||
        documentNumber == "00000000000" ||
				documentNumber == "11111111111" ||
				documentNumber == "22222222222" ||
				documentNumber == "33333333333" ||
				documentNumber == "44444444444" ||
				documentNumber == "55555555555" ||
				documentNumber == "66666666666" ||
				documentNumber == "77777777777" ||
				documentNumber == "88888888888" ||
				documentNumber == "99999999999") false
    let soma = 0
		let resto = 0
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(documentNumber.substring(i-1, i)) * (11 - i)
      resto = (soma * 10) % 11
      if ((resto == 10) || (resto == 11))  resto = 0
      if (resto != parseInt(documentNumber.substring(9, 10)) ) return false
    soma = 0
    for (var i = 1; i <= 10; i++) 
      soma = soma + parseInt(documentNumber.substring(i-1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11))  resto = 0
    if (resto != parseInt(documentNumber.substring(10, 11) ) ) return false
    return true
  }

  isValidCnpj = (documentNumber: string) => {
    if (!documentNumber.trim() ||
        documentNumber.trim().length != 14 ||
        documentNumber == "00000000000000" || 
	    	documentNumber == "11111111111111" || 
	    	documentNumber == "22222222222222" || 
	    	documentNumber == "33333333333333" || 
	    	documentNumber == "44444444444444" || 
	    	documentNumber == "55555555555555" || 
	    	documentNumber == "66666666666666" || 
	    	documentNumber == "77777777777777" || 
	    	documentNumber == "88888888888888" ||
	    	documentNumber == "99999999999999") false
    let tamanho = documentNumber.length - 2
    let numeros = documentNumber.substring(0,tamanho)
    let digitos = documentNumber.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += Number(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado.toString() != digitos.charAt(0)) return false;
    tamanho = tamanho + 1
    numeros = documentNumber.substring(0,tamanho)
    soma = 0
    pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += Number(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado.toString() != digitos.charAt(1)) return false
    return true;
  }

  formatCpfCnpj = (documentNumber: string) => {
    if (!documentNumber.trim()) return null
    return documentNumber.replace(/\D/g, '').toString()
  }  

}

export default new LocaleBrUtil()