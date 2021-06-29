import productModal from './userProductModal.js'

const app = Vue.createApp({
    data() {
        return {
            apiUrl : 'https://vue3-course-api.hexschool.io/api',
            apiPath : 'kevinhes-apistudy',
            productsData : {},
            product : {},
            carts : {},
            loadingStatus:{
                loadingItem:'',
            },
            form :{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:'',
                },
            },
            message:'',
        }
    },
    methods: {
        getData(page =1){
            axios.get(`${this.apiUrl}/${this.apiPath}/products?page=${page}`)
            .then((res) => {
                if(res.data.success){
                    console.log(res.data);
                    this.productsData = res.data.products
                }else{
                    alert(res.data.message)
                }
            })
        },
        productModal(item){
            this.loadingStatus.loadingItem = item.id 
            axios.get(`${this.apiUrl}/${this.apiPath}/product/${item.id}`)
            .then((res) => {
                if(res.data.success){
                    this.$refs.userProductModal.openModal();
                    this.loadingStatus.loadingItem = ''
                    this.product = res.data.product
                }else{
                    alert(res.data.message)
                }
            })
        },
        addCart(id,qty=1){
            const cart = {
                product_id : id,
                qty
            }
            this.loadingStatus.loadingItem = id  
            axios.post(`${this.apiUrl}/${this.apiPath}/cart`,{data : cart})
            .then((res) =>{
                if(res.data.success){
                    alert(res.data.message)
                    this.loadingStatus.loadingItem = '' 
                    this.getCartInfo()
                }else{
                    alert(res.data.message)
                }
            })
        },
        getCartInfo(){
            axios.get(`${this.apiUrl}/${this.apiPath}/cart`)
            .then((res) =>{
                if(res.data.success){
                    this.carts = res.data.data
                }else{res.data.message}
            })
        },
        updateCart(item){
            const cart = {
                product_id : item.product.id,
                qty : item.qty
            }
            this.loadingStatus.loadingItem = item.id 
            console.log(cart);  
            axios.put(`${this.apiUrl}/${this.apiPath}/cart/${item.id}`,{"data" : cart})
            .then((res) =>{
                if(res.data.success){
                    this.loadingStatus.loadingItem = ''
                    this.getCartInfo()
                }
            })
        },
        cleanCarts(){
            axios.delete(`${this.apiUrl}/${this.apiPath}/carts`)
            .then((res) => {
                if(res.data.success){
                    alert(res.data.message)
                    this.getCartInfo()
                }
            })
        },
        cleanOne(item){
            axios.delete(`${this.apiUrl}/${this.apiPath}/cart/${item.id}`)
            .then((res) =>{
                if(res.data.success){
                    alert(res.data.message)
                    this.getCartInfo() 
                }
            })
        },
        onSubmit(){
            console.log('表單送出 ');
            
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        onSubmit(){
            const user = this.form
            axios.post(`${this.apiUrl}/${this.apiPath}/order`,{"data" : user})
            .then((res=>{
                if(res.data.success){
                    alert(res.data.message)
                }
            }))
        }
    },
    mounted() {
        this.getData()
        this.getCartInfo()
    },
})
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
generateMessage: VeeValidateI18n.localize('zh_TW'),
validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.component('productModal', productModal)
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app')