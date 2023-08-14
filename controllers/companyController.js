import sendMail from "../utility/sendMail";
import dbClient from "../db/mysql";
import { v4 as uuidv4 } from "uuid";

async function registerCompany(req, res){
    const id = uuidv4();
    const company_name = req.body ? req.body.company_name : null;
    const company_info = req.body ? req.body.company_info : null;
    const company_contact = req.body ? req.body.company_contact : null;
    const website = req.body ? req.body.company_website : null;
    const user_id = res.locals.user_id

    const delete_user = `DELETE FROM users WHERE id= ?`
    
    if (!company_name){
        delUserIfError(delete_user,user_id)
        res.status(400).json({error: "Missing company name"});
        return;
    }
    if (!company_info){
        delUserIfError(delete_user,user_id)
        res.status(400).json({error: "Missing company info"});
        return;
    }
    if (!company_contact){
        delUserIfError(delete_user,user_id)
        res.status(400).json({error: "Missing company contact"});
        return;
    }
    if (!website){
        delUserIfError(delete_user, user_id)
        res.status(400).json({error: "Missing website"});
        return;
    }
    const insert_company = `INSERT INTO company_profile (id, company_name, company_info, company_contact, company_website, user_id) VALUES (?, ?, ?, ?, ?, ?)`
    const values = [id, company_name, company_info, company_contact, website, user_id];
    dbClient.db.query(insert_company, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
            delUserIfError(delete_user, user_id)
            res.status(401).json("error inserting company")
        }
        else{
            res.status(201).json("company inserted")
        }
    })
}

async function delUserIfError(delete_user, user_id){
    dbClient.db.query(delete_user, user_id,(err, res)=>{
        if(err){
            console.log(err.message)
        }
    })
}


async function createCategory(req, res){
    const id = uuidv4();
    const category_name = req.body ? req.body.category_name : null;
    const category_description = req.body ? req.body.category_description : null;
    let company_id;
    const user = JSON.parse(res.locals.user)

    if (!category_name){
        res.status(400).json({error: "Missing category name"});
        return;
    }
    if (!category_description){
        res.status(400).json({error: "Missing category description"});
        return;
    }
    const getCompanyId = `SELECT id FROM company_profile WHERE user_id = ?`;

    dbClient.db.query(getCompanyId, user.id, (err, results)=>{
        if (err){
            console.log(err.message)
        }

        if (results.length > 0){
            company_id = results[0].id
            const insert_category = `INSERT INTO project_categories (id, company_id, category_name, category_description) VALUES (?, ?, ?, ?)`;
            const values = [id, company_id, category_name, category_description]

            dbClient.db.query(insert_category, values, (err, results)=>{
                if (err){
                    console.log(err.message)
                    res.send("error inserting category");
                }

                if (results){
                    res.send("insert category successful");
                }
            })
        }
    })
}


async function getAllCategories(req, res){
    const user = JSON.parse(res.locals.user)
    let company_id;
    const categories = `SELECT * FROM project_categories WHERE company_id=?`;
    const getCompanyId = `SELECT id FROM company_profile WHERE user_id = ?`;

    dbClient.db.query(getCompanyId, user.id, (err, results)=>{
        if (err){
            console.log(err.message)
        }

        if (results.length > 0){
            company_id = results[0].id
            dbClient.db.query(categories, company_id, (err, results)=>{
                if (err){
                    console.log(err.message)
                    res.send("error searching category");
                }

                if (results.length>0){
                    res.send(results)
                }
            })
        }
    })
}

async function createProject(req, res){
    const user = JSON.parse(res.locals.user);
    const requestBody = req.body || {};  
    const projectData = {
        id: uuidv4(),
        company_id: requestBody.company_id || null,
        category_id: requestBody.category_id || null,
        project_name: requestBody.project_name || null,
        project_description: requestBody.project_description || null,
        project_manager: requestBody.project_manager || null,
        start_date: requestBody.start_date || null,
        end_date: requestBody.end_date || null,
        progress: requestBody.progress || null,
        comment: requestBody.comment || null
    };

    const requiredFields = [
        "id",
        "category_id",
        "project_name",
        "project_description",
        "project_manager",
        "start_date",
        "end_date",
        "progress",
        "comment"
    ];
    
    for (const field of requiredFields) {
        if (!projectData[field]) {
            res.status(400).json({ error: `Missing ${field.replace("_", " ")}` });
            return;
        }
    }

    let company_id;
    const getCompanyId = `SELECT id FROM company_profile WHERE user_id = ?`;
    dbClient.db.query(getCompanyId, user.id, (err, results)=>{
        if (err){
            console.log(err.message)
        }
        if (results.length > 0){
            company_id = results[0].id
            console.log(company_id)
            const insert_project = `INSERT INTO company_projects (id, company_id, category_id, project_name,
                project_description, project_manager, start_date, end_date, progress, comment)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                projectData.id,
                projectData.company_id,
                projectData.category_id,
                projectData.project_name,
                projectData.project_description,
                projectData.project_manager,
                projectData.start_date,
                projectData.end_date,
                projectData.progress,
                projectData.comment
            ];
                                

            dbClient.db.query(insert_project, values, (err, results)=>{
            if (err){
            console.log(err.message)
            res.send("error inserting project");
            }

            if (results){
            res.send("insert project successful");
            }
            })

        }else{
            console.log("company not found")
            res.send("company not found")
        }
    })

}

async function createProjectUpdate(req, res) {
    const user = JSON.parse(res.locals.user);
    const requestBody = req.body || {};
    const projectUpdateData = {
        id: uuidv4(),
        project_id: requestBody.project_id || null,
        project_manager_id: requestBody.project_manager_id || null,
        update_description: requestBody.update_description || null
    };

    const requiredFields = [
        "project_id",
        // "project_manager_id",
        "update_description"
    ];
    
    for (const field of requiredFields) {
        if (!projectUpdateData[field]) {
            res.status(400).json({ error: `Missing ${field.replace("_", " ")}` });
            return;
        }
    }

    const insert_update = `INSERT INTO project_update (id, project_id, project_manager_id, update_description)
        VALUES (?, ?, ?, ?)`;

    const values = [
        projectUpdateData.id,
        projectUpdateData.project_id,
        projectUpdateData.project_manager_id,
        projectUpdateData.update_description
    ];

    dbClient.db.query(insert_update, values, (err, results) => {
        if (err) {
            console.log(err.message);
            res.send("Error inserting project update");
        }

        if (results) {
            res.send("Insert project update successful");
        }
    });
}



const companyController = {
    registerCompany,
    createCategory,
    getAllCategories,
    createProject,
    createProjectUpdate
}

module.exports = companyController