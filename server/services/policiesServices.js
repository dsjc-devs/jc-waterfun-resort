import Policy from "../models/policiesModels.js";

const createPolicy = async (policyData) => {
  const { title, content, type } = policyData || {};

  try {
    if (!title || !content || !type || title.trim() === "" || content.trim() === "" || type.trim() === "") {
      throw new Error("Title, content, and type are required and cannot be empty");
    }

    const validTypes = ["privacy", "terms", "no_cancellation"];
    if (!validTypes.includes(type)) {
      throw new Error("Invalid type. Must be one of: privacy, terms, no_cancellation");
    }

    const payload = {
      title,
      content,
      type,
    };

    const policy = await Policy.create(payload);

    return {
      message: "Policy created successfully",
      data: policy
    };
  } catch (error) {
    console.error("Error creating policy:", error.message);
    throw new Error(error);
  }
};

const getAllPolicies = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const policies = await Policy.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Policy.countDocuments(filters);

    return {
      policies,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalPolicies: totalCount,
    };
  } catch (error) {
    console.error("Error fetching policies:", error.message);
    throw new Error(error);
  }
};

const getSinglePolicyById = async (policyId) => {
  try {
    if (!policyId) {
      throw new Error("Policy ID is required");
    }

    const policy = await Policy.findById(policyId);

    if (!policy) {
      throw new Error("Policy not found");
    }

    return {
      message: "Policy fetched successfully",
      data: policy
    };
  } catch (error) {
    console.error("Error fetching policy:", error.message);
    throw new Error(error);
  }
};



const updatePolicyById = async (policyId, updateData) => {
  try {
    if (!policyId) {
      throw new Error("Policy ID is required");
    }

    const { title, content, type } = updateData;

    if (type) {
      const validTypes = ["privacy", "terms", "no_cancellation"];
      if (!validTypes.includes(type)) {
        throw new Error("Invalid type. Must be one of: privacy, terms, no_cancellation");
      }
    }

    const updatedPolicy = await Policy.findByIdAndUpdate(
      policyId,
      { title, content, type },
      { new: true, runValidators: true }
    );

    if (!updatedPolicy) {
      throw new Error("Policy not found");
    }

    return {
      message: "Policy updated successfully",
      data: updatedPolicy
    };
  } catch (error) {
    console.error("Error updating policy:", error.message);
    throw new Error(error);
  }
};

const deletePolicyById = async (policyId) => {
  try {
    if (!policyId) {
      throw new Error("Policy ID is required");
    }

    const deletedPolicy = await Policy.findByIdAndDelete(policyId);

    if (!deletedPolicy) {
      throw new Error("Policy not found");
    }

    return "Policy deleted successfully";
  } catch (error) {
    console.error("Error deleting policy:", error.message);
    throw new Error(error);
  }
};

export default {
  createPolicy,
  getAllPolicies,
  getSinglePolicyById,
  updatePolicyById,
  deletePolicyById,
};
