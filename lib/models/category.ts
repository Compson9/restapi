import { Schema, model, models } from "mongoose";

// Define the schema for the Category model
const CategorySchema = new Schema(
    {
        title: { type: "string", required: true }, // Title of the category
        user: { type: Schema.Types.ObjectId, ref: "user" }, // Reference to the user who created the category
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

// Create the Category model if it doesn't already exist
const Category = models.Category || model("Category", CategorySchema);

export default Category; // Export the Category model

