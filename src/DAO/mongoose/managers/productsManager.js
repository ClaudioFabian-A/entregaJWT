import { productsModel } from '../models/productsModel.js';
import { json } from "express";

class productManager {
    constructor() {
        this.Product = "";
    }
    async getProducts(params) {
        //try { return await productsModel.find().lean(); } catch (error) { return error };
        let {
            limit,
            page,
            query,
            sort
        } = params;
        limit = limit ? limit : 10;
        page = page ? page : 1;
        let clave = query ? query.split(":")[0] : "";
        let valor = query ? query.split(":")[1].replace(/(")/gm, "") : "";
        let newQuery = [clave, valor];
        let newElement = Object.fromEntries([newQuery]);
        query = query ? newElement : {};
        sort = sort ? (sort == "acs" ? 1 : -1) : 0;
        let prodList = [];
        let filter = {};
        if (sort == 0) { filter = { limit: limit, page: page }; } else { filter = { limit: limit, page: page, sort: { price: sort } }; }

        try {
            prodList = await productsModel.paginate(query, filter);
            let status = prodList ? "success" : "error";
            let hasPrevPage = prodList.hasPrevPage;
            let hasNextPage = prodList.hasNextPage;
            let prevPage = prodList.prevPage;
            let nexPage = prodList.nextPage;
            let prevLink = hasPrevPage != false ? "http://localhost:8080/products/?limit=" + limit + "&page" + prevPage : null;
            let nextLink = hasNextPage != false ? "http://localhost:8080/products/?limit=" + limit + "&page" + nexPage : null;

            prodList = {
                status: status,
                payload: prodList.docs,
                totalPages: prodList.totalPages,
                prevPage: prodList.prevPage,
                nexPage: prodList.nextPage,
                page: prodList.page,
                hasPrevPage: prodList.hasPrevPage,
                hasNextPage: prodList.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink,
            };
            // console.log( prodList.docs );



        } catch (error) {
            console.log(`error en product manager 32`);
            return error
        }
        console.log(prodList);
        return prodList;


    };
    async updateProduct(id, title, description, category, price, thumbnail, code, stock) {



        let art = await this.getProductById(id);
        if ((await art) != false) {
            let addArticle = {
                title: title,
                description: description,
                category: category,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: true,

            };
            let values = [
                addArticle.title,
                addArticle.description,
                addArticle.category,
                addArticle.price,
                addArticle.thumbnail,
                addArticle.code,
                addArticle.stock,
                addArticle.status,
            ];
            let undefinedValue = values.includes(undefined);
            let emptyValue = values.includes("");

            const prodList = async () => {
                let prodList = [];
                try {
                    prodList = await productsModel.find().lean();

                } catch (error) {
                    return error;
                    console.log("product manager G");
                }
                return prodList;
            };
            let findCode = prodList().then((e) => e.map((art) => { let artE = ""; if (id != e._id) { artE = e.code } return artE }));
            let searchedCode = findCode.then((e) => e.includes(addArticle.code));

            if (!undefinedValue || !emptyValue) { await productsModel.updateOne({ _id: id }, addArticle) } else if (await searchedCode) { console.log("error product manager H"); return "codeRepetido" } else {
                console.log("error product manager I");
                return "emptyvalue";
            }
            
        }

        try {

            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch (error) {
            return error;

        }
    };
    async addProduct(title, description, category, price, thumbnail, code, stock) {
        let addArticle = {
            title: title,
            description: description,
            category: category,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            status: true,

        };
        let values = [
            addArticle.title,
            addArticle.description,
            addArticle.category,
            addArticle.price,
            addArticle.thumbnail,
            addArticle.code,
            addArticle.stock,
            addArticle.status,
        ];
        let undefinedValue = values.includes(undefined);
        let emptyValue = values.includes("");
        const prodList = async () => {
            let prodList = [];
            try {
                prodList = await productsModel.find().lean();
                return prodList;
            } catch (error) {
                return error;
            }
        };
        let findCode = prodList().then((e) => e.map((art) => art.code));
        let searchedCode = findCode.then((e) => e.includes(addArticle.code));
        if (!emptyValue || !undefinedValue) {
            await productsModel.create(addArticle);
            return true;
        } else if (await searchedCode) {
            console.log("product manager error E");
            return "repeatvalue";

        } else {
            console.log("product manager error F");
            return "emptyvalues";

        }
    };
    async getProductById(id) {
        const artId = await productsModel.find({ _id: id });
        if ((await artId) != undefined) {
            return await artId;
        } else {
            return false;
        }

    };
    async deleteProduct(id) {
        let artId = await this.getProductById(id);
        if ((await artId) != false) {
            await productsModel.findByIdAndDelete(id);
            return true;
        } else {
            console.log("error products manager J");
            // return error;

        }
        // try {
        //     return await productsModel.findByIdAndDelete(id);
        // } catch (error) {
        //     return error;
        // }
    };



}
export default productManager;