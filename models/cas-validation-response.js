class CASAttributes {
    constructor(res) {
        this.uid = res['uid'][0];
        this.ksuPersonWildcatId = res['ksuPersonWildcatId'][0];
        this.authenticationDate = res['authenticationDate'][0];
    }
}

class CASAuthenticationSuccess {
    constructor(res) {
        this.attributes = new CASAttributes(res['attributes']);
    }
}

class CASAuthenticationFailure {
    constructor(res) {
        this.code = res['code'];
        this.description = res['description'];
    }
}

class CASServiceResponse {
    constructor(res) {
        const success = res['authenticationSuccess'];
        if (success) {
            this.authenticationSuccess = new CASAuthenticationSuccess(success);
        } else {
            this.authenticationFailure = new CASAuthenticationFailure(res['authenticationFailure']);
        }
    }
}

class CASValidationResponse {
    constructor(req) {
        this.serviceResponse = new CASServiceResponse(req['serviceResponse']);
    }
    validated(){
        return this.serviceResponse.authenticationSuccess !== null;
    }
}

module.exports = {
    CASAttributes : CASAttributes,
    CASAuthenticationSuccess : CASAuthenticationSuccess,
    CASAuthenticationFailure : CASAuthenticationFailure,
    CASServiceResponse : CASServiceResponse,
    CASValidationResponse : CASValidationResponse
  }