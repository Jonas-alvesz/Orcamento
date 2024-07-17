function mostrarEscolha() {
    var escolha = document.getElementById('escolha');
    escolha.classList.toggle('mostrar');
}

let modal=document.getElementById('modal')

function modalSucesso() {
    let modalTitulo=document.getElementById('modal-titulo')
    let modalInfo=document.getElementById('modal-info')
    let modalButton=document.getElementById('modal-button')

    modalTitulo.innerHTML='Registro inserido com sucesso'
    modalTitulo.style.color='green'
    modalButton.style.background='green'
    modalInfo.innerHTML='Despesa foi cadastrada com sucesso'
    modalButton.innerHTML='Voltar'
    
    modal.showModal()
}
function modalErro() {
    let modalTitulo=document.getElementById('modal-titulo')
    let modalInfo=document.getElementById('modal-info')
    let modalButton=document.getElementById('modal-button')
    
    modalTitulo.innerHTML='Erro na inclusão do registro'
    modalTitulo.style.color='red'
    modalButton.style.background='red'
    modalInfo.innerHTML='Erro na gravação verifique se todos os campos foram preenchidos corretamente'
    modalButton.innerHTML='voltar e corrigir'
    modal.showModal()
}



class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano=ano
        this.mes=mes
        this.dia=dia
        this.tipo=tipo
        this.descricao=descricao
        this.valor=valor
    }
    ValidarDados(){
        for( const i in this){
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd{
    constructor(){
        let id=localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id',0)
        }
    }
    getProximoId(){
        let proximoId=localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d){
        let id=this.getProximoId()
        localStorage.setItem(id,JSON.stringify(d))
        localStorage.setItem('id',id)
    }
    recuperarTodosRegistros(){

        let despesas= Array()

        let id = localStorage.getItem('id')

        for(let i=1;i<=id;i++){

            let despesa=JSON.parse(localStorage.getItem(i))

            if (despesa==null) {
                continue
            }
            // q vai ser utilizado na remoção 
            despesa.id=i
            
            despesas.push(despesa)
           
        }
        return despesas

    }
    pesquisar(despesa){
        let despesasFiltradas=Array()

        despesasFiltradas= this.recuperarTodosRegistros()

        
        
        if (despesa.ano != '') {
            despesasFiltradas= despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        if (despesa.mes != '') {
            despesasFiltradas= despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        
        if (despesa.dia != '') {
            despesasFiltradas=despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            despesasFiltradas= despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesasFiltradas=despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            despesasFiltradas=despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}
let bd =new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    
    let despesa=new Despesa(ano.value,mes.value,dia.value,tipo.value,descricao.value,valor.value)
    
    if (despesa.ValidarDados()) {
        modalSucesso()
        ano.value=''
        mes.value=''
        dia.value=''
        tipo.value=''
        descricao.value=''
        valor.value=''
         bd.gravar(despesa)
    }else{
        modalErro()
    }

}

function carregarListaDespesas(){
    let despesas=Array()

    despesas=bd.recuperarTodosRegistros()
    
    
   mostrarNaTabela(despesas)
}
function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    
    let despesa= new Despesa(ano,mes,dia,tipo,descricao,valor)

   let lista=bd.pesquisar(despesa)

   mostrarNaTabela(lista)

}

function mostrarNaTabela(array) {
    let table=document.getElementById('listaDespesas')
    table.innerHTML=''

    array.forEach(valor => {
        
        let linha =table.insertRow()
      

        // cria as colunas
         linha.insertCell(0).innerHTML=`${valor.dia}/${valor.mes}/${valor.ano}`
         
         switch (valor.tipo) {
             case '1':
                 valor.tipo='Alimentação'
                 break;
                 case '2':
                     valor.tipo='Educação'
                     break;
                     case '3':
                         valor.tipo='Lazer'
                         break;
                         case '4':
                             valor.tipo='Saúde'
                break;
                case '5':
                valor.tipo='Tranporte'
                break;
            }

            linha.insertCell(1).innerHTML=valor.tipo

         linha.insertCell(2).innerHTML=valor.descricao
         linha.insertCell(3).innerHTML=valor.valor

        //  criar o botão de exclusão
        let btn=document.createElement('button')
        // adiciona uma classe a ela
        btn.className='botao'
        // bota o icone de x nela
        btn.innerHTML='<span class="material-symbols-outlined">close</span>'
        // vai pegar o atributo id do objeto e pondo como id do botao
        btn.id=`id_despesa_${valor.id}`
            btn.onclick=function () {

                let id=this.id.replace('id_despesa_','')
                
                bd.remover(id)
                
                window.location.reload()
            }




        // vai por o botão na celula da tabela
         linha.insertCell(4).append(btn)
        

    });
}