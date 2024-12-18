import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema (
    {
        title: {type: "string", required: true},
        user: {types: Schema.Types.ObjectId, ref:"user"},
    },
    {
        timestamps: true,
    }
   
)

const Category = models.Category || model("Category", CategorySchema);

export default Category

