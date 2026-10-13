/account/connect, error no puede cancelar el sistema 

- Al cargar la cuenta nueva, aparece una cuenta que no tiene nada que ver @exampleAccount.ts
- El proceso de conectar una cuenta se siente muy lento, muy pesado, y al final no termino de cargar bien la cuenta, requiere una sincronizacion. Al momento de conectarla con la API, no desconectar de inmediato (account.undeploy())

 account/getTradesHistory, {account_mt_id: "3e2e3a45-a674-4a72-b121-cdab219aa978", startTime: "2021-01-01 00:00:00.000",…}
account_mt_id
: 
"3e2e3a45-a674-4a72-b121-cdab219aa978"
endTime
: 
"2025-12-07 08:13:13.000"
startTime
: 
"2021-01-01 00:00:00.000"


AND: /account/metrics, {
  "status": 200,
  "data": null,
  "message": "Account found but no trades available yet. Please sync the account to generate metrics.",
  "needsSync": true
}



