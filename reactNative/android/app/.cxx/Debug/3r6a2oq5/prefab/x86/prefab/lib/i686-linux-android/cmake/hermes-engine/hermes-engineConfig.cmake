if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/donghyun/.gradle/caches/8.13/transforms/05d88a454e859816b9bc0b86d187f0da/transformed/hermes-android-0.82.1-debug/prefab/modules/hermesvm/libs/android.x86/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/donghyun/.gradle/caches/8.13/transforms/05d88a454e859816b9bc0b86d187f0da/transformed/hermes-android-0.82.1-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

