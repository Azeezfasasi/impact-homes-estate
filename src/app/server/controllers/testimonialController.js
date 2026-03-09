import Testimonial from '../models/Testimonial.js';
import { connectDB } from '../db/connect.js';

const DEFAULT_TESTIMONIALS = {
  testimonials: [
    {
      name: 'John Adewale',
      position: 'Project Manager, Alpha Industries',
      message: 'Impact Homes Real Estate delivered beyond expectations. Their team showed exceptional professionalism and technical expertise throughout our property inspection.',
      rating: 5,
      order: 0,
      active: true,
    },
    {
      name: 'Maria Okafor',
      position: 'Director, GreenBuild Ltd.',
      message: 'The Impact Homes Real Estate team provided invaluable insights during our recent project. Their attention to detail and commitment to quality is unmatched in the industry.',
      rating: 5,
      order: 1,
      active: true,
    },
    {
      name: 'Engr. David Uche',
      position: 'CEO, Uche Group',
      message: "As a seasoned real estate developer, I can confidently say that Impact Homes Real Estate is a top-tier company. Their innovative solutions and customer-centric approach have made them a trusted partner in all our projects.",
      rating: 5,
      order: 2,
      active: true,
    },
  ],
};

export async function getTestimonials() {
  try {
    await connectDB();

    let testimonialData = await Testimonial.findOne();

    if (!testimonialData) {
      testimonialData = await Testimonial.create(DEFAULT_TESTIMONIALS);
    }

    return {
      success: true,
      testimonials: testimonialData.testimonials || [],
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function createTestimonial(testimonialData) {
  try {
    await connectDB();

    let collection = await Testimonial.findOne();
    if (!collection) {
      collection = await Testimonial.create(DEFAULT_TESTIMONIALS);
    }

    const newTestimonial = {
      ...testimonialData,
      order: collection.testimonials.length,
    };

    collection.testimonials.push(newTestimonial);
    collection.updatedAt = new Date();
    await collection.save();

    return {
      success: true,
      testimonial: collection.testimonials[collection.testimonials.length - 1],
    };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateTestimonial(testimonialId, testimonialData) {
  try {
    await connectDB();

    const collection = await Testimonial.findOne();
    if (!collection) {
      return {
        success: false,
        error: 'Testimonial collection not found',
      };
    }

    const testimonialIndex = collection.testimonials.findIndex(
      (t) => t._id.toString() === testimonialId
    );

    if (testimonialIndex === -1) {
      return {
        success: false,
        error: 'Testimonial not found',
      };
    }

    collection.testimonials[testimonialIndex] = {
      ...collection.testimonials[testimonialIndex],
      ...testimonialData,
      _id: collection.testimonials[testimonialIndex]._id,
    };

    collection.updatedAt = new Date();
    await collection.save();

    return {
      success: true,
      testimonial: collection.testimonials[testimonialIndex],
    };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteTestimonial(testimonialId) {
  try {
    await connectDB();

    const collection = await Testimonial.findOne();
    if (!collection) {
      return {
        success: false,
        error: 'Testimonial collection not found',
      };
    }

    const initialLength = collection.testimonials.length;
    collection.testimonials = collection.testimonials.filter(
      (t) => t._id.toString() !== testimonialId
    );

    if (collection.testimonials.length === initialLength) {
      return {
        success: false,
        error: 'Testimonial not found',
      };
    }

    // Reorder remaining testimonials
    collection.testimonials.forEach((testimonial, index) => {
      testimonial.order = index;
    });

    collection.updatedAt = new Date();
    await collection.save();

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function reorderTestimonials(testimonialIds) {
  try {
    await connectDB();

    const collection = await Testimonial.findOne();
    if (!collection) {
      return {
        success: false,
        error: 'Testimonial collection not found',
      };
    }

    const newOrder = [];
    for (const id of testimonialIds) {
      const testimonial = collection.testimonials.find((t) => t._id.toString() === id);
      if (testimonial) {
        newOrder.push(testimonial);
      }
    }

    if (newOrder.length !== collection.testimonials.length) {
      return {
        success: false,
        error: 'Invalid reorder request',
      };
    }

    newOrder.forEach((testimonial, index) => {
      testimonial.order = index;
    });

    collection.testimonials = newOrder;
    collection.updatedAt = new Date();
    await collection.save();

    return {
      success: true,
      testimonials: collection.testimonials,
    };
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
