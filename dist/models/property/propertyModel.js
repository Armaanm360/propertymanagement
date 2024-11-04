"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
/**
 * PropertyModel class that extends the Schema and provides methods
 * for interacting with property-related data in the database.
 */
class PropertyModel extends schema_1.default {
    /**
     * Constructor that initializes the PropertyModel with a database connection.
     * @param db - The database connection object.
     */
    constructor(db) {
        super(); // Call the parent constructor from Schema
        this.db = db; // Assign the database connection
    }
    /**
     * Retrieves a list of client properties based on provided filters and options.
     *
     * @param {Object} params - Filter parameters for property retrieval.
     * @param {number} [params.limit] - Maximum number of properties to return.
     * @param {number} [params.skip] - Number of properties to skip for pagination.
     * @param {string} [params.propertyType] - Type of the property to filter.
     * @param {number} [params.minPrice] - Minimum price for filtering.
     * @param {number} [params.maxPrice] - Maximum price for filtering.
     * @param {string} [params.location] - Location to search for properties.
     * @param {number[]} [params.rooms] - Array of rooms to filter properties.
     * @param {number[]} [params.bathrooms] - Array of bathrooms to filter properties.
     * @param {string[]} [params.amenities] - Array of amenities to filter properties.
     * @param {string[]} [params.features] - Array of features to filter properties.
     * @param {string} [params.status] - Status of the reservation to filter.
     * @param {string} [params.sortBy] - Column name to sort the results.
     * @param {'asc' | 'desc'} [params.sortOrder] - Order of sorting.
     * @returns {Promise<{ total: number; data: any[] }>} - Total properties and the list of properties.
     */
    getClientProperties({ limit, skip, propertyType, propertyArea, minPrice, maxPrice, location, rooms, bathrooms, amenities, features, status, sortBy, sortOrder, agent_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('property_master_view as pmv').withSchema(this.PROPERTY_SCHEMA);
            // Applying filters based on provided parameters
            if (propertyType) {
                dtbs.where('property_type', propertyType); // Filter by property type
            }
            if (minPrice !== undefined) {
                dtbs.andWhere('price', '>=', minPrice); // Filter by minimum price
            }
            if (maxPrice !== undefined) {
                dtbs.andWhere('price', '<=', maxPrice); // Filter by maximum price
            }
            if (location) {
                dtbs.andWhere((builder) => {
                    // Search for location in address, title, or name
                    builder
                        .where('property_address', 'ILIKE', `%${location}%`)
                        .orWhere('property_title', 'ILIKE', `%${location}%`)
                        .orWhere('property_name', 'ILIKE', `%${location}%`);
                });
            }
            if (rooms && rooms.length > 0) {
                dtbs.whereIn('rooms', rooms); // Filter by room count
            }
            if (bathrooms && bathrooms.length > 0) {
                dtbs.whereIn('bathrooms', bathrooms); // Filter by bathroom count
            }
            if (amenities && amenities.length > 0) {
                dtbs.where(function () {
                    // Filter by amenities
                    for (const amenity of amenities) {
                        this.orWhereRaw('amenities::text ILIKE ?', [`%"name":"${amenity}"%`]);
                    }
                });
            }
            if (features && features.length > 0) {
                dtbs.where(function () {
                    // Filter by features
                    for (const feature of features) {
                        this.orWhereRaw('features::text ILIKE ?', [`%"name":"${feature}"%`]);
                    }
                });
            }
            if (status) {
                dtbs.where('reservation_status', status); // Filter by reservation status
            }
            // filter by agent id
            if (agent_id) {
                dtbs.where('agent_id', agent_id); // Filter by reservation status
            }
            // Sorting based on specified column and order
            const validSortColumns = [
                'property_id',
                'property_name',
                'property_area',
                'property_created_at',
                'rooms',
                'bathrooms',
                'floor_number',
                'price',
                'property_type',
            ];
            if (sortBy && validSortColumns.includes(sortBy)) {
                dtbs.orderBy(sortBy, sortOrder || 'asc'); // Apply sorting
            }
            else {
                dtbs.orderBy('property_id', 'desc'); // Default sorting by property_id
            }
            // Pagination settings
            if (limit !== undefined && skip !== undefined) {
                dtbs.limit(limit).offset(skip); // Limit and offset for pagination
            }
            const data = yield dtbs.select('*'); // Execute the query to get data
            const total = data.length; // Get total number of properties
            // Return total count and formatted property data
            return {
                total: total,
                data: data.map(this.formatPropertyData), // Format the property data
            };
        });
    }
    /**
     * Formats the property data for consistent response structure.
     *
     * @param {any} property - The property object to format.
     * @returns {Object} - Formatted property object.
     */
    formatPropertyData(property) {
        return {
            id: property.property_id,
            name: property.property_name,
            title: property.property_title,
            propertyArea: property.property_area,
            viewCount: Number(property.view_count),
            description: property.property_description,
            address: property.property_address,
            createdAt: property.property_created_at,
            updatedAt: property.property_updated_at,
            rooms: property.rooms,
            bathrooms: property.bathrooms,
            floorNumber: property.floor_number,
            location: {
                latitude: property.latitude,
                longitude: property.longitude,
            },
            price: property.price,
            verification: property.verification,
            verified_at: property.verified_at,
            rejection_reason: property.rejection_reason,
            agentName: property.agent_name,
            agentPhone: property.agent_phone,
            agentEmail: property.agent_email,
            agentIsActive: property.agent_is_active,
            agentCommissionRate: property.agent_commission_rate,
            propertyType: property.property_type,
            amenities: property.amenities || [],
            features: property.features || [],
            images: property.images || [],
            documents: property.documents || [],
            reservationStatus: property.reservation_status,
        };
    }
    /**
     * Retrieves a single property by its ID.
     *
     * @param {number} id - The ID of the property to retrieve.
     * @returns {Promise<any>} - The property object.
     */
    getSingleProperty(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, agent_id } = query;
            return yield this.db('property_master_view AS pmv')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('pmv.*', 'ps.status AS property_status_name')
                .leftJoin('property_status_history AS ps', 'ps.id', 'pmv.property_status')
                .where((qb) => {
                if (id) {
                    qb.andWhere('pmv.property_id', id);
                }
                if (agent_id) {
                    qb.andWhere('pmv.agent_id', agent_id);
                }
            });
        });
    }
    //update property
    verifyProperty(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db('properties')
                .withSchema(this.PROPERTY_SCHEMA)
                .update(payload) // verify new property
                .where({ id: id });
        });
    }
    /**
     * Creates a new property in the database.
     *
     * @param {any} payload - The property data to insert.
     * @returns {Promise<any>} - The created property object.
     */
    createProperty(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('properties')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload) // Insert new property
                .returning('*'); // Return the inserted property data
            return data;
        });
    }
    /**
     * Adds amenities to a property.
     *
     * @param {any} payload - The amenities data to insert.
     * @returns {Promise<any>} - The added amenities object.
     */
    addAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('property_amenities')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload) // Insert amenities
                .returning('*'); // Return the inserted amenities data
            return data;
        });
    }
    /**
     * Adds features to a property.
     *
     * @param {any} payload - The features data to insert.
     * @returns {Promise<any>} - The added features object.
     */
    addFeatures(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('property_features')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload); // Insert features
            return data; // Return the added features data
        });
    }
    /**
     * Adds images to a property.
     *
     * @param {any} payload - The images data to insert.
     * @returns {Promise<any>} - The added images object.
     */
    addImages(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('property_images')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload); // Insert images
            return data; // Return the added images data
        });
    }
    /**
     * Adds documents to a property.
     *
     * @param {any} payload - The documents data to insert.
     * @returns {Promise<any>} - The added documents object.
     */
    addDocuments(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('property_documents')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload); // Insert documents
            return data; // Return the added documents data
        });
    }
    /**
     * Updates a property by its ID.
     *
     * @param {number} id - The ID of the property to update.
     * @param {any} payload - The updated property data.
     * @returns {Promise<number>} - The number of rows affected.
     */
    updateProperty(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCount = yield this.db('properties')
                .withSchema(this.PROPERTY_SCHEMA)
                .where({ id: id }) // Locate the property by ID
                .update(payload); // Update the property with new data
            return updatedCount; // Return the count of updated rows
        });
    }
    /**
     * Deletes a property by its ID (soft delete).
     *
     * @param {number} id - The ID of the property to delete.
     * @returns {Promise<number>} - The number of rows affected.
     */
    deleteProperty(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCount = yield this.db('properties')
                .withSchema(this.PROPERTY_SCHEMA)
                .where({ id: id })
                .update({ is_deleted: true }); // Mark the property as deleted
            return deletedCount; // Return the count of deleted rows
        });
    }
    // Delete features based on property ID and optional feature IDs
    deleteFeatures(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_features')
                .withSchema(this.PROPERTY_SCHEMA)
                .del('id')
                .where((qb) => {
                if (query.ids) {
                    qb.whereIn('feature_id', query.ids);
                }
                qb.andWhere('property_id', query.property_id);
            });
        });
    }
    // Delete amenities based on property ID and optional amenity IDs
    deleteAmenities(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_amenities')
                .withSchema(this.PROPERTY_SCHEMA)
                .where((qb) => {
                if (query.ids) {
                    qb.whereIn('amenity_id', query.ids);
                }
                qb.andWhere('property_id', query.property_id);
            })
                .del();
        });
    }
    // Delete documents based on property ID and optional document IDs
    deleteDocuments(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_documents')
                .withSchema(this.PROPERTY_SCHEMA)
                .delete('id')
                .where((qb) => {
                if (query.ids) {
                    qb.whereIn('id', query.ids);
                }
                qb.andWhere('property_id', query.property_id);
            });
        });
    }
    // Delete images based on property ID and optional image IDs
    deleteImages(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_images')
                .withSchema(this.PROPERTY_SCHEMA)
                .delete('id')
                .where((qb) => {
                if (query.ids) {
                    qb.whereIn('id', query.ids);
                }
                qb.andWhere('property_id', query.property_id);
            });
        });
    }
    // Fetch documents associated with a property
    getDocuments(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_documents')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where('property_id', propertyId);
        });
    }
    // public async getLeads(agent_id: number) {
    //   return await this.db('vw_property_inquiries')
    //     .withSchema(this.PROPERTY_SCHEMA)
    //     .select('*')
    //     .where('agent_id', agent_id);
    // }
    getLeads(agent_id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('vw_property_inquiries')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .andWhere('agent_id', agent_id)
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('vw_property_inquiries.inquirer_name', `%${query.key}%`);
                }
            });
            if (query.limit) {
                data.limit(query.limit);
            }
            if (query.skip) {
                data.offset(query.skip);
            }
            const total = yield this.db('vw_property_inquiries')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('inquiry_id AS total')
                .andWhere('agent_id', agent_id)
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('vw_property_inquiries.name', `%${query.key}%`);
                }
            });
            return {
                data: yield data,
                total: total[0].total,
            };
        });
    }
    // Fetch images associated with a property
    getImages(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_images')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where('property_id', propertyId);
        });
    }
    // get features
    getFeatures(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_features')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where('property_id', propertyId);
        });
    }
    // delete eminities
    getEminities(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_amenities')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where('property_id', propertyId);
        });
    }
    // get all property tpes
    getAllPropertyTypes(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('property_types')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            if (query.limit) {
                data.limit(query.limit);
            }
            if (query.skip) {
                data.offset(query.skip);
            }
            const total = yield this.db('property_types')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('id AS total')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            return {
                data: yield data,
                total: total[0].total,
            };
        });
    }
    // get all status
    getAllPropertyStatus(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('property_status_history')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('status', `%${query.key}%`);
                }
            });
            if (query.limit) {
                data.limit(query.limit);
            }
            if (query.skip) {
                data.offset(query.skip);
            }
            const total = yield this.db('property_status_history')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('id AS total')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('status', `%${query.key}%`);
                }
            });
            return {
                data: yield data,
                total: total[0].total,
            };
        });
    }
    //property view count
    propertyViewCount(property_id, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_views')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert({ property_id: property_id, ip_address: ipAddress });
        });
    }
    //add track to my lead!
    addTrackingToLead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('inquiry_tracking')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload);
        });
    }
    //add track to my lead!
    updateLead(lead_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_inquiries')
                .withSchema(this.PROPERTY_SCHEMA)
                .where({ id: lead_id })
                .update(payload);
        });
    }
    //add inquiry
    addInquiry(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_inquiries')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload);
        });
    }
    //add property_listings
    listingProperty(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_listings')
                .withSchema(this.PROPERTY_SCHEMA)
                .insert(payload);
        });
    }
    // get all Amenity
    getAllAmenity(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('amenity_master')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            if (query.limit) {
                data.limit(query.limit);
            }
            if (query.skip) {
                data.offset(query.skip);
            }
            const total = yield this.db('amenity_master')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('id AS total')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            return {
                data: yield data,
                total: total[0].total,
            };
        });
    }
    // get all features
    getAllFeature(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('feature_master')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            if (query.limit) {
                data.limit(query.limit);
            }
            if (query.skip) {
                data.offset(query.skip);
            }
            const total = yield this.db('feature_master')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('id AS total')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            return {
                data: yield data,
                total: total[0].total,
            };
        });
    }
    // get all properties listing
    getAllPropertyListing(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('property_listings_view')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            if (query.limit) {
                data.limit(query.limit);
            }
            if (query.skip) {
                data.offset(query.skip);
            }
            const total = yield this.db('feature_master')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('id AS total')
                .where((qb) => {
                if (query.key) {
                    qb.andWhereILike('name', `%${query.key}%`);
                }
            });
            return {
                data: yield data,
                total: total[0].total,
            };
        });
    }
}
exports.default = PropertyModel; // Export the PropertyModel for use in other modules
